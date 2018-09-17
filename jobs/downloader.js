/**
 * Created by cheewu on 2018/9/17.
 */
const http = require('http')
const fs = require('fs')
const schedule = require('node-schedule')
const logger = require('../utils/logger')
const conf = require('../config/job')


function download() {
  logger.log('start download...')
  const url = conf.downloadUrl
  const dest = conf.rarFilePath
  const dataDir = conf.dataDir
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
  }
  const file = fs.createWriteStream(dest)
  const request = http.get(url, function(response) {
    response.pipe(file)
  })

  file.on('finish', function() {
    file.close()
    logger.log('download done!')
  })

  // check for request error too
  request.on('error', function (err) {
    fs.unlink(dest)
    logger.log('downloader err: ', err)
  })

  file.on('error', function(err) { // Handle errors
    fs.unlink(dest)
    logger.log('file err: ', err)
  })
}


function start() {
  logger.log('downloader start...')

  download()

  // 6小时下载一次
  schedule.scheduleJob('* * /6 * *', function() {
    download()
  })
}


module.exports = {
  start
}


