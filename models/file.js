/**
 * Created by cheewu on 2018/9/17.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const FileSchema = new Schema({
  id: { type: ObjectId, index:true },
  md5: { type: String },
  filePath: { type: String },
})

module.exports = mongoose.model('File', FileSchema)