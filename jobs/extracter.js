/**
 * Created by cheewu on 2018/9/13.
 */
const crypto = require('crypto')
const fs = require('fs')
const chokidar = require('chokidar')
const unrar = require('./unrar')
const conf = require('../config/job')
const logger = require('../utils/logger')


function md5File(cb) {
  const rs = fs.createReadStream(conf.rarFilePath)
  const hash = crypto.createHash('md5')

  rs.on('data', buffer => {
    hash.update(buffer)
  })

  rs.on('end', function () {
    return cb(hash.digest('hex'))
  })
}

function extract() {
  logger.log('start extract ...')
  unrar(conf.rarFilePath, conf.txtDataFileDir)
  logger.log('extract done!')
}

function start() {
  logger.log('extracter start...')
  const watcher = chokidar.watch(conf.rarFilePath)

  watcher.on('change', path => {
    // todo: get oldMd5 from mongo
    const oldMd5 = '7f1ada111c8785451a3123cb2c5c182f'

    const cb = function (md5) {
      if (md5 !== oldMd5) {
        logger.log(`${path} has changed.`)
        extract()
      } else {
        logger.log(`${path} not changed`)
      }
    }

    md5File(cb)
  })
}

module.exports = {
  start
}