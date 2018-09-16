/**
 * Created by cheewu on 2018/9/13.
 */
const { execute }= require('../utils/sys')

function unrar(filePath, outputPath) {
  execute(`unrar e ${filePath} ${outputPath}`)
}

module.exports = unrar