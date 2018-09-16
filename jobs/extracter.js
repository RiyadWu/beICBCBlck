/**
 * Created by cheewu on 2018/9/13.
 */
const crypto = require('crypto')
const fs = require('fs')
const chokidar = require('chokidar')
const { File } = require('../models')
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

function saveFile(filePath, md5) {
  return new Promise(function () {
    file = new File({ filePath, md5 })

    file.save(function (err) {
      if (err) {
        logger.log('Save Error: ', err)
        return Promise.reject()
      }

      logger.log('file has saved in mongo.')
    })
  })
}

function updateFile(filePath, md5, file) {
  return new Promise(function () {
    file.update({ filePath }, { md5 }, function (err) {
      if (err) {
        logger.log('Update Error: ', err)
        return Promise.reject()
      }
      logger.log('file has updated in mongo.')
    })
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
    File.findOne({ filePath: path}, function (err, file) {
      if (file) {
        const cb = function (md5) {
          if (md5 !== file.md5) {
            logger.log(`${path} has changed.`)
            updateFile(path, md5, file)
              .then(() => {
                extract()
              })
          } else {
            logger.log(`${path} not changed`)
          }
        }

        md5File(cb)
      } else {
        const cb = function (md5) {
          saveFile(path, md5)
            .then(() => {
              extract()
            })
        }

        md5File(cb)
      }
    })
  })
}

module.exports = {
  start
}