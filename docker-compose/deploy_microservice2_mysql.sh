#!/usr/bin/env bash
# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

configure_aws_cli(){
	aws --version
	aws configure set default.region eu-central-1
	aws configure set default.output json
}

deploy_cluster() {

    family="MesCourses-microservice2-mysql"
    cluster="arn:aws:ecs:eu-central-1:142221551378:cluster/test3"
    service="MesCourses-microservice2-mysql"

    make_task_def
    register_definition
   if [[ $(aws ecs update-service --cluster $cluster --service $service --task-definition $revision | \
                  $JQ '.service.taskDefinition') != $revision ]]; then
       echo "Error updating service."
       return 1
   fi

   echo "Service update "${service}" successful."
   return 0
}

make_task_def(){
	task_template='
    {
      "dnsSearchDomains": [],
      "entryPoint": [],
      "portMappings": [
        {
          "hostPort": 3306,
          "protocol": "tcp",
          "containerPort": 3306
        }
      ],
      "command": [
        "mysqld",
        "--lower_case_table_names=1",
        "--skip-ssl",
        "--character_set_server=utf8",
        "--explicit_defaults_for_timestamp"
      ],
      "cpu": 0,
      "environment": [
        {
          "name": "MYSQL_ALLOW_EMPTY_PASSWORD",
          "value": "no"
        },
        {
            "name": "SPRING_DATASOURCE_PASSWORD",
            "value": "%s"
        },
        {
          "name": "MYSQL_DATABASE",
          "value": "microservice2"
        },
        {
          "name": "MYSQL_USER",
          "value": "root"
        }
      ],
      "dnsServers": [],
      "mountPoints": [
        {
          "containerPath": "/var/lib/mysql",
          "sourceVolume": "volume-0"
        }
      ],
      "dockerSecurityOptions": [],
      "memory": 950,
      "volumesFrom": [],
      "image": "mysql:5.7.19",
      "essential": true,
      "links": [],
      "readonlyRootFilesystem": false,
      "privileged": false,
      "name": "microservice2-mysql"
    }'


    volumes='
        {
            "name": "volume-0",
            "host": {
                "sourcePath": "/home/ec2-user/central-config-server"
            }
        }'


placementConstraints='
{
      "type": "memberOf",
      "expression": "attribute:Name=~Microservice2-Mysql"
}'

	task_def=$(printf "$task_template" $SPRING_DATASOURCE_PASSWORD)
	echo task_def
}

push_ecr_image(){
	eval $(aws ecr get-login --no-include-email --region eu-central-1)
	docker tag microservice2:latest 142221551378.dkr.ecr.eu-central-1.amazonaws.com/microservice2:latest
	docker push 142221551378.dkr.ecr.eu-central-1.amazonaws.com/microservice2:latest
}

register_definition() {

    if revision=$(aws ecs register-task-definition --family $family --container-definitions "$task_template" --placement-constraints "$placementConstraints" --volumes "$volumes" | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
    else
        echo "Failed to register task definition"
        return 1
    fi

}

configure_aws_cli
push_ecr_image
deploy_cluster
