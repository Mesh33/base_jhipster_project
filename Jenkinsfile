#!/usr/bin/env groovy

node {
    stage('checkout') {
        checkout scm
    }

    docker.image('openjdk:8').inside('-u root') {
        stage('check java') {
            sh "java -version"
        }

    }

    def dockerImage
    stage('build docker') {
    }

    stage('publish docker') {
        docker.withRegistry('https://hub.docker.com/r/mesh33/mescourses/', 'docker-login') {
            dockerImage.push 'latest'
        }
    }
}
