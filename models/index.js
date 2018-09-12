/**
 * Created by cheewu on 2018/9/12.
 */
const mongoose = require('mongoose');
const dbConfig = require('../config/mongoConfig')

mongoose.connect(dbConfig.dbPath, {
  poolSize: 20 ,
  keepAlive: 120
}).then(() => {
  console.log('mongo connected')
}, err => {
  console.log('mongo connect failed! Reason: ', err)
})

const Mcc = require('./mcc')

module.exports = {
  Mcc
}
