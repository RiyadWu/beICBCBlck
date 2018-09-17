/**
 * Created by cheewu on 2018/9/14.
 */
const fs = require('fs')
const readline = require('readline')
const iconv = require('iconv-lite')
const chokidar = require('chokidar')
const { Mcc } = require('../models')
const logger = require('../utils/logger')
const conf = require('../config/job')

const batchSize = 50000
const fileProcessed = {}


function getFileList(path, callback) {
  fs.readdir(path, (err, files) => {
    if (err) {
      logger.log(err)
      callback([])
    }
    callback(files)
  })
}

function bulkInsert(bulkToInsert) {
  Mcc.insertMany(bulkToInsert, function (err) {
    if (err) {
      logger.log('Bulk insert error! Error is: ', err)
    } else {
      logger.log('Bulk insert done!')
    }
  })
}

function importData() {
  getFileList(conf.txtDataFileDir, files => {
    files.forEach(file => {
      if (fileProcessed[file]) {
        console.log('file has processed: ', file)
        return
      } else {
        fileProcessed[file] = true
      }

      const path = conf.txtDataFileDir + file
      const lineReader = readline.createInterface({
        input: fs.createReadStream(path).pipe(iconv.decodeStream('gbk'))
      })
      let arr = []

      lineReader.on('line', function (line) {
        const [mcc, shop] = line.split(',')
        arr.push({ mcc, shop })
        if (arr.length === batchSize) {
          const bulkToInsert = [].concat(arr)

          bulkInsert(bulkToInsert)
          arr = []
        }
      })

      lineReader.on('close', function () {
        logger.log('file close')
        if (arr.length > 0) {
          bulkInsert(arr)
        }
      })
    })
  })
}

function start() {
  logger.log('importer start...')
  const dataDir = conf.txtDataFileDir
  const watcher = chokidar.watch(dataDir)

  watcher.on('change', path => {
    logger.log(path)
    importData()
  })
}

module.exports = {
  start,
  importData
}