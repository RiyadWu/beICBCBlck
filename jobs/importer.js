/**
 * Created by cheewu on 2018/9/14.
 */
const fs = require('fs')
const chokidar = require('chokidar')
const logger = require('../utils/logger')
const conf = require('../config/job')

function getFileList(path, callback) {
  fs.readdir(path, (err, files) => {
    if (err) {
      logger.log(err)
      callback([])
    }
    callback(files)
  })
}

function importData(callback) {
  getFileList(conf.txtDataFileDir, files => {
    logger.log(files)
    callback(null)
  })
}

function start() {
  logger.log('importer start...')
  const dataDir = conf.txtDataFileDir
  const watcher = chokidar.watch(dataDir)

  watcher.on('change', path => {
    logger.log(path)
  })
}

module.exports = {
  start,
  importData
}