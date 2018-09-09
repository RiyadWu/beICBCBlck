const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())
app.options('*', cors())

app.get('/', function (req, res) {
    const businessNumber = req.query.businessNumber
    res.send(`Hello World! ${ businessNumber }`)
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})