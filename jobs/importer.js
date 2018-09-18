/**
 * Created by cheewu on 2018/9/14.
 */
const fs = require('fs')
const readline = require('readline')
const iconv = require('iconv-lite')
const chokidar = require('chokidar')
const mv = require('mv')
const { Mcc } = require('../models')
const logger = require('../utils/logger')
const conf = require('../config/job')

const batchSize = 5000
const fileProcessed = {}
let unprocessedFile = []
let fileProcessing = false
let taskQueue = []
let resolving = false

function tryResolveTask() {
  logger.log('try resolve task')
  if (!resolving) {
    resolving = true
    resolveTask()
  }
}

function resolveTask() {
  logger.log('resolve task')
  if (taskQueue.length > 0) {
    bulkInsert(taskQueue.splice(0, batchSize), resolveTask)
  } else {
    resolving = false
  }
}

function getFileList(path, callback) {
  fs.readdir(path, (err, files) => {
    if (err) {
      logger.log(err)
      callback([])
    }
    callback(files)
  })
}

function bulkInsert(bulkToInsert, cb) {
  Mcc.insertMany(bulkToInsert, function (err) {
    if (err) {
      logger.log('Bulk insert error! Error is: ', err)
    } else {
      logger.log('Bulk insert done!')
      cb()
    }
  })
}

function tryProcessFile() {
  logger.log('try process file!')
  if (!fileProcessing) {
    fileProcessing = true
    processFile()
  } else {
    fileProcessing = false
  }
}

function processFile() {
  logger.log('process file!')
  if (unprocessedFile.length === 0) {
    setTimeout(() => {
      if (unprocessedFile.length === 0) {
        tryResolveTask()
      }
    }, 5000)
    return
  }

  const file = unprocessedFile.splice(0, 1)[0]

  if (fileProcessed[file]) {
    console.log('file has processed: ', file)
    processFile()
  } else {
    fileProcessed[file] = true
    readFile(file, processFile)
  }
}

function readFile(file, cb) {
  logger.log('read file: ', file)
  const month = file.substr(0, 8)
  const processedDir = conf.processedDataFileDir
  const processedPath = processedDir + file
  const path = conf.txtDataFileDir + file
  const lineReader = readline.createInterface({
    input: fs.createReadStream(path).pipe(iconv.decodeStream('gbk'))
  })

  lineReader.on('line', function (line) {
    const [mcc, shop] = line.split(',')
    taskQueue.push({ mcc, shop, month })
  })

  lineReader.on('close', function () {
    logger.log('file close: ', file)

    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir)
    }

    mv(path, processedPath, function(err) {
      if (err) {
        logger.log('mv file failed.')
      } else {
        logger.log(`File ${file} has been moved successfully.`)
      }
      cb()
    })
  })
}

function importData() {
  getFileList(conf.txtDataFileDir, files => {
    unprocessedFile = unprocessedFile.concat(files)
    tryProcessFile()
  })
}

function start() {
  logger.log('importer start...')
  const dataDir = conf.txtDataFileDir
  const watcher = chokidar.watch(dataDir)

  watcher.on('change', path => {
    logger.log('file change: ', path)
    importData()
  })
}

module.exports = {
  start,
  importData
}