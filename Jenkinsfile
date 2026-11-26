pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker compose build'
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
            echo 'Pipeline succeeded! All containers are up and healthy.'
        }
        failure {
            echo 'Pipeline failed! Check Console Output for details.'
        }
    }
}
