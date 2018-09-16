/**
 * Created by cheewu on 2018/9/14.
 */
const downloader = require('./downloader')
const extracter = require('./extracter')
const importer = require('./importer')

function start() {
  downloader.start()
  extracter.start()
  importer.start()
}

module.exports = {
  start
}