/*
 * @Author: czy0729
 * @Date: 2020-02-14 20:34:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-02-19 12:07:49
 */
const axios = require('axios')
const HTMLParser = require('./html-parser')

const INIT_MONO = {
  name: '', // 日文名
  nameCn: '', // 中文名
  cover: '', // 封面
  info: '', // 简介
  detail: '', // 内容详情
  voices: [], // 最近演出角色
  works: [], // 最近参与
  jobs: [] // 出演
}

async function fetchMono(monoId = 21628, type = 'character') {
  // -------------------- 请求HTML --------------------
  const { data: raw } = await axios({
    url: `https://bgm.tv/${type}/${monoId}`
  })
  const HTML = HTMLTrim(raw)

  // -------------------- 分析内容 --------------------
  let node
  let matchHTML

  // 人物信息
  const mono = {
    ...INIT_MONO
  }

  if (HTML) {
    // 标题
    matchHTML = HTML.match(/<h1 class="nameSingle">(.+?)<\/h1>/)
    if (matchHTML) {
      const tree = HTMLToTree(matchHTML[1])
      node = findTreeNode(tree.children, 'a|text&title')
      if (node) {
        mono.name = node[0].text[0]
        mono.nameCn = node[0].attrs.title
      }
    }

    // 封面
    // @issue
    matchHTML =
      HTML.match(/<img src="(.+?)" class="cover"\/>/) ||
      HTML.match(/<img src="(.+?)" class="cover" \/>/)
    if (matchHTML) {
      mono.cover = String(matchHTML[1]).split('?')[0]
    }

    // 各种详细
    matchHTML = HTML.match(/<ul id="infobox">(.+?)<\/ul>/)
    if (matchHTML) {
      mono.info = String(matchHTML[1])
        .replace(/\n/g, '')
        .replace(/ class="(.+?)"/g, '')
        .replace(/ title="(.+?)"/g, '')
        .replace(/>( +)</g, '><')
        .trim()
    }

    // 详情
    matchHTML = HTML.match(/<div class="detail">(.+?)<\/div>/)
    if (matchHTML) {
      mono.detail = matchHTML[1]
    }

    // 最近演出角色
    mono.voices = []
    matchHTML = HTML.match(
      /<h2 class="subtitle">最近演出角色<\/h2><ul class="browserList">(.+?)<\/ul><a href=/
    )
    if (matchHTML) {
      const tree = HTMLToTree(matchHTML[1])
      tree.children.forEach(item => {
        const { children } = item
        node = findTreeNode(children, 'div > a|href&title')
        const href = node ? node[0].attrs.href : ''
        const name = node ? node[0].attrs.title : ''
        node = findTreeNode(children, 'div > div > h3 > p')
        const nameCn = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'div > a > img')
        const cover = node ? String(node[0].attrs.src).split('?')[0] : ''
        node = findTreeNode(children, 'ul > li > div > h3 > a|text&href')
        const subjectHref = node ? node[0].attrs.href : ''
        const subjectName = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'ul > li > div > small')
        const subjectNameCn = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'ul > li > div > span')
        const staff = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'ul > li > a > img')
        const subjectCover = node ? String(node[0].attrs.src).split('?')[0] : ''
        mono.voices.push({
          href,
          name: HTMLDecode(name),
          nameCn: HTMLDecode(nameCn),
          cover,
          subjectHref,
          subjectName: HTMLDecode(subjectName),
          subjectNameCn: HTMLDecode(subjectNameCn),
          staff,
          subjectCover
        })
      })
    }

    // 最近参与
    mono.works = []
    matchHTML = HTML.match(
      /<h2 class="subtitle">最近参与<\/h2><ul class="browserList">(.+?)<\/ul><a href=/
    )
    if (matchHTML) {
      const tree = HTMLToTree(matchHTML[1])
      tree.children.forEach(item => {
        const { children } = item
        node = findTreeNode(children, 'div > a|href&title')
        const href = node ? node[0].attrs.href : ''
        const name = node ? node[0].attrs.title : ''
        node = findTreeNode(children, 'div > a > img')
        const cover = node ? String(node[0].attrs.src).split('?')[0] : ''
        node = findTreeNode(children, 'div > div > span')
        const staff = node ? node[0].text[0] : ''
        mono.works.push({
          href,
          name: HTMLDecode(name),
          cover,
          staff
        })
      })
    }

    // 出演
    mono.jobs = []
    matchHTML = HTML.match(
      /<h2 class="subtitle">出演<\/h2><ul class="browserList">(.+?)<\/ul><div class="section_line clear">/
    )
    if (matchHTML) {
      const tree = HTMLToTree(matchHTML[1])
      tree.children.forEach(item => {
        const { children } = item
        node = findTreeNode(children, 'div > div > h3 > a')
        const href = node ? node[0].attrs.href : ''
        const name = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'div > div > small')
        const nameCn = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'div > a > img')
        const cover = node ? String(node[0].attrs.src).split('?')[0] : ''
        node = findTreeNode(children, 'div > div > span')
        const staff = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'ul > li > a')
        const cast = node ? node[0].attrs.title : ''
        const castHref = node ? node[0].attrs.href : ''
        node = findTreeNode(children, 'ul > li > div > small')
        const castTag = node ? node[0].text[0] : ''
        node = findTreeNode(children, 'ul > li > a > img')
        const castCover = node ? String(node[0].attrs.src).split('?')[0] : ''
        mono.jobs.push({
          href,
          name: HTMLDecode(name),
          nameCn,
          cover,
          staff,
          cast,
          castHref,
          castTag,
          castCover
        })
      })
    }
  }

  if (!mono.voices.length) {
    delete mono.voices
  }
  if (!mono.works.length) {
    delete mono.works
  }
  if (!mono.jobs.length) {
    delete mono.jobs
  }

  return Promise.resolve(mono)
}

function removeCF(HTML = '') {
  return HTML.replace(
    /<script[^>]*>([\s\S](?!<script))*?<\/script>|<noscript[^>]*>([\s\S](?!<script))*?<\/noscript>|style="display:none;visibility:hidden;"/g,
    ''
  ).replace(/data-cfsrc/g, 'src')
}

function HTMLTrim(str = '') {
  if (typeof str !== 'string') {
    return str
  }
  return (
    removeCF(str)
      // .replace(/<!--.*?-->/gi, '')
      // .replace(/\/\*.*?\*\//gi, '')
      // .replace(/[ ]+</gi, '<')
      .replace(/\n+|\s\s\s*|\t/g, '')
      .replace(/"class="/g, '" class="')

      // 补充 190829
      .replace(/> </g, '><')
  )
}

function HTMLToTree(html, cmd = true) {
  const tree = {
    tag: 'root',
    attrs: {},
    text: [],
    children: []
  }
  if (cmd) {
    tree.cmd = 'root'
  }
  let ref = tree

  HTMLParser.HTMLParser(html, {
    start: (tag, attrs, unary) => {
      const attrsMap = {}
      attrs.forEach(({ name, value, escaped }) => {
        // @issue 190507
        // 带有cookie的请求经过cloudflare返回的html部分attr的属性被加上了data-cf前缀??? 醉了
        const _name = name.replace('data-cf', '')
        return (attrsMap[_name] = escaped || value)
      })
      const item = {
        tag,
        attrs: attrsMap
      }
      if (cmd) {
        item.cmd = `${ref.cmd} > ${tag}`
      }
      if (!unary) {
        item.parent = ref
        item.text = []
        item.children = []
      }
      ref.children.push(item)

      if (!unary) {
        ref = item
      }
    },
    chars: text => {
      ref.text.push(text)
    },
    end: () => {
      const _ref = ref.parent
      delete ref.parent
      ref = _ref
    }
  })

  return tree
}

function findTreeNode(children, cmd = '', defaultValue) {
  if (!cmd) {
    return children
  }

  const split = ' > '
  const tags = cmd.split(split)
  const tag = tags.shift()
  const find = children.filter(item => {
    let temp = tag.split('|')
    const _tag = temp[0]
    const attr = temp[1] || ''

    if (attr) {
      const attrs = attr.split('&')
      let match = true
      attrs.forEach(attr => {
        if (attr.indexOf('~') !== -1) {
          // ~
          temp = attr.split('~')
          const _attr = temp[0]
          const _value = temp[1]
          if (_value) {
            match =
              match &&
              item.tag === _tag &&
              item.attrs[_attr] &&
              item.attrs[_attr].indexOf(_value) !== -1
          } else if (_attr) {
            match =
              match && item.tag === _tag && item.attrs[_attr] !== undefined
          }
        } else {
          // =
          temp = attr.split('=')
          const _attr = temp[0]
          const _value = temp[1]
          if (_value) {
            match = match && item.tag === _tag && item.attrs[_attr] == _value
          } else if (_attr) {
            if (_attr === 'text') {
              match = match && item.tag === _tag && item.text.length !== 0
            } else {
              match =
                match && item.tag === _tag && item.attrs[_attr] !== undefined
            }
          }
        }
      })
      return match
    }
    return item.tag === _tag
  })
  if (!find.length) {
    return undefined || defaultValue
  }
  if (!tags.length) {
    return find
  }

  const _find = []
  find.forEach(item => {
    _find.push(...(findTreeNode(item.children, tags.join(split)) || []))
  })
  if (!_find.length) {
    return undefined || defaultValue
  }
  return _find
}

function HTMLDecode(str = '') {
  if (str.length === 0) {
    return ''
  }
  return (
    str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      // eslint-disable-next-line quotes
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
  )
}

module.exports = {
  fetchMono
}
