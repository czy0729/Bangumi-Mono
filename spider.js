/*
 * @Author: czy0729
 * @Date: 2020-01-14 18:51:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-02-21 10:27:21
 */
const fs = require('fs')
const path = require('path')
const utils = require('./utils/utils')
const oldFetch = require('./utils/old-fetch')

const rewrite = true
const type = 'character' // character | person
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
  Cookie:
    'chii_cookietime=2592000; chii_theme_choose=1; prg_list_mode=full; chii_theme=dark; __utmz=1.1612160564.2339.91.utmcsr=tongji.baidu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; chii_auth=P%2BIXbnLOd7rB0%2B%2FMvAwZNE92bKWF2dkFHfuR5GjFuwX9lmP694IjhnU%2BtGVRkM7FJfPK%2BagBaZCoUtvHnZzSzua%2BRWe42vW2upi9; prg_display_mode=normal; __utmc=1; chii_sid=4ilz40; __utma=1.7292625.1567003648.1613871737.1613874216.2408; __utmt=1; __utmb=1.1.10.1613874216',
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
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/book-2021.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/book-2020.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/book-rank.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/game-2021.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/game-2020.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/game-rank.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/music-2021.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/music-2020.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/music-rank.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/real-2021.json')),
    ...JSON.parse(fs.readFileSync('../Bangumi-Subject/ids/real-2020.json')),
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
  try {
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
  } catch (error) {}
})
const uniqueIds = Array.from(new Set(ids))
// const uniqueIds = JSON.parse(
//   fs.readFileSync('../Bangumi-Static/data/tinygrail/ids-msrc.json')
// )

function fetchMono(id, index) {
  return new Promise(async (resolve, reject) => {
    const filePath = `./${type === 'character' ? 'data' : type}/${Math.floor(
      id / 100
    )}/${id}.json`
    if (!rewrite && fs.existsSync(filePath)) {
      console.log(`- skip ${id}.json [${index} / ${uniqueIds.length}]`)
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
