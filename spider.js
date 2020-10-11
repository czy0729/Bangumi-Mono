/*
 * @Author: czy0729
 * @Date: 2020-01-14 18:51:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-10-11 18:27:16
 */
const fs = require('fs')
const path = require('path')
const utils = require('./utils/utils')
const oldFetch = require('./utils/old-fetch')

const type = 'person' // character | person
const headers = {
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
  cookie:
    'chii_cookietime=2592000; chii_theme_choose=1; prg_list_mode=full; chii_theme=dark; __utmz=1.1600135666.1796.73.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; prg_display_mode=normal; __utma=1.7292625.1567003648.1602399732.1602408304.1878; __utmc=1; __utmt=1; chii_sid=w5zGdx; chii_auth=eBRcrR9pFw19lO6E%2FEEj7gTnSnGPdnwG%2BcOTvy4%2BCd%2BPDhlngb%2F8y12rcO2ewWRAb9TN5i3xTHONL7hZrK6GZgQSHKcBoJngH1yp; __utmb=1.4.10.1602408304',
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
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/wk8-series.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/wk8.json')),
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
    if (fs.existsSync(filePath)) {
      // console.log(`- skip ${id}.json [${index} / ${ids.length}]`)
      return resolve(true)
    }

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
