/*
 * @Author: czy0729
 * @Date: 2020-03-12 11:44:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-05-02 20:22:28
 */
const fs = require('fs')
const path = require('path')
const join = require('path').join
const utils = require('./utils/utils')
const oldFetch = require('./utils/old-fetch')

const type = 'person'

const filePaths = []
function findJsonFile(path) {
  fs.readdirSync(path).forEach((item, index) => {
    const fPath = join(path, item)
    const stat = fs.statSync(fPath)
    if (stat.isDirectory() === true) {
      findJsonFile(fPath)
    }
    if (stat.isFile() === true && fPath !== 'data/topic/.DS_Store') {
      filePaths.push(fPath)
    }
  })
}
findJsonFile('./data')

const ids = []
filePaths.forEach((item) => {
  const { jobs } = JSON.parse(fs.readFileSync(item))
  if (!jobs) {
    return
  }

  jobs.forEach((i) => {
    if (i.castHref.includes('/person/')) {
      ids.push(i.castHref.replace('/person/', ''))
    }
  })
})
const uniqueIds = Array.from(new Set(ids))
// const uniqueIds = [8138]

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

    console.log(`- writing ${id}.json [${index} / ${uniqueIds.length}]`)
    fs.writeFileSync(
      filePath,
      utils.safeStringify(data, data.nameCn || data.name)
    )

    return resolve(true)
  })
}

const fetchs = uniqueIds.map((id, index) => () => fetchMono(id, index))
utils.queue(fetchs, 6)
