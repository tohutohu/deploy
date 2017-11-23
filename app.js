const http  =  require('http')
const notify  = require('/home/conoha/manager/src/notification')
const {exec}  =  require('child_process')

const createHandler = require('github-webhook-handler')
const handler = createHandler({path: '/', secret: process.env.SECRET || 'test'})


const server = http.createServer((req, res) => {
  handler(req, res, (req, res) => {
    res.statusCode = 404
    res.end('Not found')
  })
}).listen(7777)

handler.on('push', event => {
  const payload = event.payload;
  const repoName = payload.repository.name;
  const branch = payload.ref.split("/").pop();

  if (repoName === 'NuxtBlog' && branch === "master") {
    // デプロイ処理や更新通知など (Twitter,Slack,etc...)
    exec('sh ./update_nuxtblog.sh', (err, stdout, stderr) => {
      console.log(err, stdout, stderr)
      if(err) {
        notify({
          title: 'NuxtBlogデプロイ結果',
          body: 'デプロイに失敗しました\n' + stderr
        })
      } else {
        notify({
          title: 'NuxtBlogデプロイ結果',
          body: 'デプロイに成功しました\n' + stdout
        })
      }
    })
  }
})
