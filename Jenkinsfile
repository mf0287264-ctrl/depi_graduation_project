pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker tag hexa-frontend:v1 mohamedfarid22/depi:frontend
                        docker tag hexa-user:v1 mohamedfarid22/depi:user-service
                        docker tag hexa-catalog:v1 mohamedfarid22/depi:catalog-service
                        docker tag hexa-search:v1 mohamedfarid22/depi:search-service
                        docker tag hexa-payment:v1 mohamedfarid22/depi:payment-service

                        docker push mohamedfarid22/depi:frontend
                        docker push mohamedfarid22/depi:user-service
                        docker push mohamedfarid22/depi:catalog-service
                        docker push mohamedfarid22/depi:search-service
                        docker push mohamedfarid22/depi:payment-service

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }

        stage('Test') {
            steps {
                sh 'sleep 5'
                sh 'curl -f http://localhost/api/user-service/health'
                sh 'curl -f http://localhost/api/catalog-service/health'
                sh 'curl -f http://localhost/api/search-service/health'
                sh 'curl -f http://localhost/api/payment-service/health'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! Images pushed and all containers are up and healthy.'
        }
        failure {
            echo 'Pipeline failed! Check Console Output for details.'
        }
    }
}