/**
 * Created by cheewu on 2018/9/13.
 */
const exec = require('child_process').exec;
const logger = require('./logger')

function execute(command) {
  logger.log('excute start...')
  try {
    exec(command, function (err) {
      if (err) {
        logger.log('Excute Error: ', err)
      } else {
        logger.log('Excute Done!')
      }
    })
  } catch (e) {
    logger.log('Excute Error: ', e)
  }
}

module.exports = {
  execute
}
