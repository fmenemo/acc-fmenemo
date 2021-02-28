pipeline {
  agent any
  stages {
    stage('Lerna') {
      steps {
        nvm(version: 'lts/dubnium') {
          sh 'npm i -g lerna'
          sh 'npm run bootstrap'
        }
      }
    }
    stage('Build') {
      steps {
        nvm(version: 'lts/dubnium') {
          sh 'npm run build:all'
        }
      }
    }
    stage('Upload') {
      steps {
        sh 'mv package acc-fmenemo-microservices-new'
        sh 'scp -o StrictHostKeyChecking=no -r acc-fmenemo-microservices-new USER@MACHINE_IP:/home/acc-fmenemo-microservices-new/.'
      }
    }
    stage('Initialization') {
      steps {
        sh 'ssh -o StrictHostKeyChecking=no -t "USER@MACHINE_IP" \'bash -i -c "cd /home/acc-fmenemo-microservices-new && nvm use lts/dubnium && npm i -g lerna && npm run bootstrap:prod"\''
      }
    }
    stage('Stop current PM2') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          sh 'ssh -o StrictHostKeyChecking=no -t "USER@MACHINE_IP" \'bash -i -c "cd /home/acc-fmenemo-microservices && npm run pm2:stop:all"\''
        }
      }
    }
    stage('RM current') {
      steps {
        sh 'ssh -o StrictHostKeyChecking=no USER@MACHINE_IP "rm -rf /home/acc-fmenemo-microservices"'
      }
    }
    stage('Deploy') {
      steps {
        sh 'ssh -o StrictHostKeyChecking=no USER@MACHINE_IP "mv /home/acc-fmenemo-microservices-new /home/acc-fmenemo-microservices"'
      }
    }
    stage('Restart PM2') {
      steps {
        sh 'ssh -o StrictHostKeyChecking=no -t "USER@MACHINE_IP" \'bash -i -c "cd /home/acc-fmenemo-microservices && npm run pm2:all"\''
      }
    }
    stage('Clean workspace') {
      steps {
          cleanWs()
      }
    }
  }
}
