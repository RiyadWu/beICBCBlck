const express = require('express')
const route = require('./routes')
const jobManager = require('./jobs')
const app = express()

jobManager.start()

app.get('/', route.getMcc)

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})