/**
 * Created by cheewu on 2018/9/12.
 */
const mongoose = require('mongoose');
const dbConfig = require('../config/mongodb')
const logger = require('../utils/logger')

mongoose.connect(dbConfig.dbPath, {
  poolSize: 20 ,
  keepAlive: 120
}).then(() => {
  logger.log('mongo connected')
}, err => {
  logger.log('mongo connect failed! Reason: ', err)
})

const Mcc = require('./mcc')
const File = require('./file')

module.exports = {
  Mcc,
  File
}
