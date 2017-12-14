#!/usr/bin/env bash
# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

configure_aws_cli(){
	aws --version
	aws configure set default.region eu-central-1
	aws configure set default.output json
}

deploy_cluster() {

    family="MesCourses-task"
    cluster="arn:aws:ecs:eu-central-1:142221551378:cluster/MesCourses-cluster"
    service="MesCourses-service"

    make_task_def
    register_definition
   if [[ $(aws ecs update-service --cluster $cluster --service $service --task-definition $revision | \
                  $JQ '.service.taskDefinition') != $revision ]]; then
       echo "Error updating service."
       return 1
   fi

   return 1
}

make_task_def(){
	task_template='[
    {
            "entryPoint": [],
            "portMappings": [
                {
                    "hostPort": 8080,
                    "protocol": "tcp",
                    "containerPort": 8080
                }
            ],
            "command": [],

            "cpu": 0,
            "environment": [
                {
                    "name": "EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE",
                    "value": "http://admin:admin@jhipster-registry:8761/eureka"
                },
                {
                    "name": "JHIPSTER_REGISTRY_PASSWORD",
                    "value": "admin"
                },
                {
                    "name": "JHIPSTER_SLEEP",
                    "value": "20"
                },
                {
                    "name": "SPRING_CLOUD_CONFIG_URI",
                    "value": "http://admin:admin@jhipster-registry:8761/config"
                },
                {
                    "name": "SPRING_DATASOURCE_URL",
                    "value": "jdbc:mysql://gateway-mysql:3306/gateway?useUnicode=true&characterEncoding=utf8&useSSL=false"
                },
                {
                    "name": "SPRING_PROFILES_ACTIVE",
                    "value": "prod,swagger"
                }
            ],
            "dnsServers": [],
            "dockerSecurityOptions": [],
            "memory": 900,
            "image": "142221551378.dkr.ecr.eu-central-1.amazonaws.com/gateway",
            "essential": true,
            "links": [],
            "extraHosts": [
                {
                    "ipAddress": "172.17.0.4",
                    "hostname": "jhipster-registry"
                },
                {
                    "ipAddress": "172.17.0.3",
                    "hostname": "gateway-mysql"
                }
            ],
            "readonlyRootFilesystem": false,
            "privileged": true,
            "name": "gateway-app"
        }
]'
# taskRoleArn='null'
 #    networkMode='bridge'
   
    volumes='
        {
            "name": "volume-0",
            "host": {
                "sourcePath": "/home/ec2-user/central-config-server"
            }
        }'

	task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
	echo task_def
}

push_ecr_image(){
	eval $(aws ecr get-login --no-include-email --region eu-central-1)

	docker push $AWS_ACCOUNT_ID.dkr.ecr.eu-central-1.amazonaws.com/gateway:latest
}

register_definition() {

    if revision=$(aws ecs register-task-definition --family $family --container-definitions "$task_template" --volumes "$volumes" | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
    else
        echo "Failed to register task definition"
        return 1
    fi

}

configure_aws_cli
push_ecr_image
deploy_cluster
