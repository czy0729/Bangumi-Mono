/*
 * @Author: czy0729
 * @Date: 2020-01-14 18:51:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-08-10 00:34:55
 */
const fs = require('fs')
const path = require('path')
const utils = require('./utils/utils')
const oldFetch = require('./utils/old-fetch')

const type = 'person' // character | person
const file = 'anime-2021.json'
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
  Cookie:
    '__cfduid=d10ce460503307836b7f7dfc6f19b10b11567003647; chii_cookietime=2592000; chii_theme_choose=1; prg_list_mode=full; prg_display_mode=normal; __utmz=1.1595138713.1545.69.utmcsr=tongji.baidu.com|utmccn=(referral)|utmcmd=referral|utmcct=/web/28208841/trend/latest; chii_theme=dark; __utmc=1; chii_searchDateLine=0; __utma=1.7292625.1567003648.1596860087.1596865033.1622; __utmt=1; chii_sid=zk53HA; chii_auth=MhC3h6SUV9MTRltnbl0U2HMA9swTI%2BN0tdxPtvPS9QKYgfQcIxdcgZzHrX44UF4JWEST2xQTCEdtMFkFBpV9yv8BZAAW824QDdZD; __utmb=1.4.10.1596865033',
}

const filePaths = []
function findJsonFile() {
  const ids = [
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/anime-2021.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/anime-2020.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/anime-rank.json')),
    ...JSON.parse(
      fs.readFileSync('../Bangumi-Subject/ids/anime-bangumi-data.json')
    ),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/book-rank.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/game-rank.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/music-rank.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/real-rank.json')),
  ]

  let notExists = 0
  ids.forEach((item) => {
    const path = `../Bangumi-Subject/data/${Math.floor(
      item / 100
    )}/${item}.json`
    if (fs.existsSync(path)) {
      filePaths.push(path)
    } else {
      notExists += 1
    }
  })
  console.log(`not exists files: ${notExists}`)
}
findJsonFile()

const ids = []
filePaths.forEach((item, index) => {
  if (type === 'character') {
    const { crt } = JSON.parse(fs.readFileSync(item))
    if (!crt) {
      return
    }
    crt.forEach((i) => {
      ids.push(i.id)
    })
  }

  if (type === 'person') {
    const { staff } = JSON.parse(fs.readFileSync(item))
    if (!staff) {
      return
    }
    staff.forEach((i) => {
      ids.push(i.id)
    })
  }
})
const uniqueIds = Array.from(new Set(ids))

function fetchMono(id, index) {
  return new Promise(async (resolve, reject) => {
    const filePath = `./${type === 'character' ? 'data' : type}/${Math.floor(
      id / 100
    )}/${id}.json`
    // if (fs.existsSync(filePath)) {
    //   // console.log(`- skip ${id}.json [${index} / ${ids.length}]`)
    //   return resolve(true)
    // }

    const data = await oldFetch.fetchMono(id, type)

    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }

    console.log(
      `- writing ${id}.json [${index} / ${uniqueIds.length}]`,
      data.nameCn || data.name
    )
    fs.writeFileSync(filePath, utils.safeStringify(data))

    return resolve(true)
  })
}

const fetchs = uniqueIds.map((id, index) => () => fetchMono(id, index))
utils.queue(fetchs, 6)
