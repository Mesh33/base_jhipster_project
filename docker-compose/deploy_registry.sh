#!/usr/bin/env bash
# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

configure_aws_cli(){
	aws --version
	aws configure set default.region eu-central-1
	aws configure set default.output json
}

deploy_cluster() {

    family="MesCourses-registry"
    cluster="arn:aws:ecs:eu-central-1:142221551378:cluster/test3"
    service="MesCourses-registry"

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
          "hostPort": 8761,
          "protocol": "tcp",
          "containerPort": 8761
        }
      ],
      "cpu": 0,
      "environment": [
        {
          "name": "JHIPSTER_REGISTRY_PASSWORD",
          "value": "%s"
        },
        {
          "name": "SECURITY_USER_PASSWORD",
          "value": "%s"
        },
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "dev,native"
        }
      ],
      "dnsServers": [],
      "dockerSecurityOptions": [],
      "memory": 950,
      "volumesFrom": [],
      "image": "jhipster/jhipster-registry:v3.1.2",
      "essential": true,
      "links": [],
      "readonlyRootFilesystem": false,
      "privileged": false,
      "name": "jhipster-registry"
    }'


placementConstraints='
{
      "type": "memberOf",
      "expression": "attribute:Name=~Registry"
}'

	task_def=$(printf "$task_template" $JHIPSTER_REGISTRY_PASSWORD $SECURITY_USER_PASSWORD)
	echo task_def
}

#push_ecr_image(){
#	eval $(aws ecr get-login --no-include-email --region eu-central-1)
#}

register_definition() {

    if revision=$(aws ecs register-task-definition --family $family --container-definitions "$task_template" --placement-constraints "$placementConstraints" | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
    else
        echo "Failed to register task definition"
        return 1
    fi

}

configure_aws_cli
#push_ecr_image
deploy_cluster
