const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())
app.options('*', cors())

app.post('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})