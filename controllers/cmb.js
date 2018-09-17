/**
 * Created by cheewu on 2018/9/12.
 */
const { Mcc } = require('../models')
const logger = require('../utils/logger')

function getMcc(req, res, next) {
  logger.log('getMcc')
  const mcc = req.query.businessNumber
  Mcc.find({ mcc }).then(docs => {
    return res.send(docs)
  }, err => {
    return res.send(err)
  })
}

module.exports = {
  getMcc
}
