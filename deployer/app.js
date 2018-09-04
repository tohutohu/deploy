const http  =  require('http')
const {spawn, execSync}  =  require('child_process')

const createHandler = require('github-webhook-handler')
const handler = createHandler({path: '/', secret: process.env.SECRET || 'test'})

const fs = require('fs')
const path = require('path')

const BASE_DIR = process.env.BASE_DIR

const server = http.createServer((req, res) => {
  handler(req, res, err => {
    res.end('Not found')
  })
}).listen(7777)

handler.on('push', event => {
  const payload = event.payload
  const repoName = payload.repository.name
  const repoURL = payload.repository.url
  const repoDir = BASE_DIR + '/' + repoName 
  const branch = payload.ref.split("/").pop()
  console.log('Deploy started ...')
  console.log(repoDir)

  if (branch === 'master') {
    fs.mkdir(repoDir, err => {
      if (!err) {
        execSync('git clone ' + repoURL, {cwd: BASE_DIR, shell: '/bin/bash'})
      }

      execSync('git fetch', {cwd: repoDir, shell: '/bin/bash'})
      execSync('git reset --hard origin/master', {cwd: repoDir, shell: '/bin/bash'})
      fs.copyFileSync('./docker-compose.override.yml', repoDir + '/docker-compose.override.yml')
      execSync(`docker-compose up --build -d`, {cwd: repoDir, shell: '/bin/bash'})
    })
  }
})
