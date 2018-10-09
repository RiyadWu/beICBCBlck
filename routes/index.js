/**
 * Created by cheewu on 2018/9/12.
 */
const cmb = require('../controllers/cmb')
const getMcc = cmb.getMcc

const mfh = require('../controllers/mfh')
const minilistSs = mfh.minilistSs

module.exports = {
  getMcc,
  minilistSs
}