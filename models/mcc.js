/**
 * Created by cheewu on 2018/9/13.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const MccSchema = new Schema({
  id: {type: ObjectId, index:true},
})

module.exports = mongoose.model('Mcc', MccSchema)