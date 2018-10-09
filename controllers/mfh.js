const request = require('request')
const cheerio = require('cheerio')


function minilistSs(req, res, next) {
  const option = {
    url: "http://119.18.194.36/miniIf/MinilistSs",
    headers: {
      Cookie: 'BIGipServerpool_SD_DaiLiShang=788615178.36895.0000; ace_settings=%7B%22navbar-fixed%22%3A1%2C%22sidebar-fixed%22%3A1%2C%22breadcrumbs-fixed%22%3A1%7D; JSESSIONID=7285ED4D16B73C6FCE9DD02B01C34590'
    },
    form: {
      pageSize: 20,
      pageNum: 1,
      mecTyp: '04',
      mercOprMbl: '18655571897'
    }
  }

    // 'pageSize=20&pageNum=1&prov=&city=&mno=&contNmCn=&crpIdNo=&accountNumber=&mecSts=&empNm=&openStartTm=&openEndTm=&mecProvCd=&rat1=&rat3=&creStartTm=&creEndTm=&mecTyp=04&isBrush=&mercOprMbl=&orgNo=&depositStatus='
  request.post(option, function(err, httpResponse, body){
    // console.log('err: ', err)
    // console.log('httpResponse: ', httpResponse)
    // console.log('body: ', body)
    const bodyStr = body.toString()

    dataFilter(bodyStr)
    return res.send(body.toString())
  })
}

function dataFilter(doc) {
  const $ = cheerio.load(doc)
  const keyNodes = $('table thead tr th')
  const valueNodes = $('table tbody tr td')
  const keys = []
  const values = []
  for (let i = 0; i < keyNodes.length; i++) {
    keys.push(keyNodes.eq(i).text())
    values.push(valueNodes.eq(i).text())
  }

  console.log('keys: ', JSON.stringify(keys), 'values: ', JSON.stringify(values))
}

module.exports = {
  minilistSs
}