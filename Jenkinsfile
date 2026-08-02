pipeline {
    agent any

    triggers {
        pollSCM('H H * * *')
    }

    environment {
        REGISTRY = "docker.jojoaddison.net"
        IMAGE_NAME = "kojo-stack"
        // Jenkins credentials ID for your Docker registry
        REGISTRY_CREDENTIALS_ID = "docker-jojoaddison-net-credentials"
        // Jenkins credentials ID for your Git repository
        GIT_CREDENTIALS_ID = "kojo-git-ssh-priv-key"
        // Version
        BUILD_NUMBER = "2026.01.${BUILD_NUMBER}"
    }

    stages {
        /**
            stage('Checkout') {
                steps {
                    git url: 'https://github.com/kojoampia/kojo-stack.git',
                    branch: 'main',
                    credentialsId: GIT_CREDENTIALS_ID
                }
            }
        */
        stage('Install') {
            steps {
                sh 'npm ci --no-audit --no-fund'
            }
        }
        stage('Lint') {
            steps {
                // Fails on errors only; existing warnings do not break the build.
                sh 'npm run lint'
            }
        }
        stage('Test') {
            steps {
                // The Docker build does not run tests, so this is the only place
                // the suite executes. ChromeHeadlessCI runs without a sandbox.
                sh 'npm run test:ci'
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                script {
                    def imageName = "${REGISTRY}/${IMAGE_NAME}"
                    def imageURL = "${imageName}:${env.BUILD_NUMBER}"
                    echo "${imageURL}"
                    sh "docker build -t ${imageName}:${env.BUILD_NUMBER} ."
                    withCredentials([usernamePassword(credentialsId: REGISTRY_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin https://${REGISTRY}"
                        sh "docker push ${imageName}:${env.BUILD_NUMBER}"
                        sh "docker tag ${imageName}:${env.BUILD_NUMBER} ${imageName}:latest"
                        sh "docker push ${imageName}:latest"
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
