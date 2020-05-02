/*
 * @Author: czy0729
 * @Date: 2020-01-14 18:51:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-05-02 22:08:25
 */
const fs = require('fs')
const path = require('path')
const utils = require('./utils/utils')
const oldFetch = require('./utils/old-fetch')

const type = 'person' // character | person

const filePaths = []
function findJsonFile(path) {
  const ids = JSON.parse(fs.readFileSync(path))
  ids.forEach((item) =>
    filePaths.push(
      `../Bangumi-Subject/data/${Math.floor(item / 100)}/${item}.json`
    )
  )
}
findJsonFile('../Bangumi-Subject/ids/anime-rank.json')
// console.log(filePaths)

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
// const uniqueIds = [8138]

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
