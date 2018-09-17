/**
 * Created by cheewu on 2018/9/13.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const MccSchema = new Schema({
  id: { type: ObjectId, index:true },
  mcc: { type: String, index:true },
  shop: { type: String }
})

module.exports = mongoose.model('Mcc', MccSchema)
