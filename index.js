const express = require('express')
const route = require('./routes')
const app = express()


app.get('/', route.getMcc)

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})