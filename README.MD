## Bangumi 人物静态数据快照

[![](https://data.jsdelivr.com/v1/package/gh/czy0729/Bangumi-Mono/badge)](https://www.jsdelivr.com/package/gh/czy0729/Bangumi-Mono)

服务于 [Bangumi-App](https://github.com/czy0729/Bangumi).

因服务器在国外, App 里请求官方 API 和分析网页整合数据渲染特别慢, 所以对 [精选条目](https://github.com/czy0729/Bangumi-Subject) 里面的 `character` 和 `person` 进行了爬虫快照 (30w 条目里面划了 3w, 覆盖正常用户点击的 90%条目), 以达到网页服务器慢也不影响 App 内卡住的目的.

人物页面数据 fallback: 网页解释 > 官方 API > bangumi-data > CDN.

通过 jsdelivr 达到白嫖效果.

### 使用方法

```
https://cdn.jsdelivr.net/gh/czy0729/Bangumi-Mono@master/${type}/${parseInt(parseInt(monoId) / 100)}/${monoId}.json
```

分为 `角色 => character => */data/*` 和 `人物 => person => */person/*`

例如 character 为 `character/21627` 姬柊雪菜 访问地址为

```
https://cdn.jsdelivr.net/gh/czy0729/Bangumi-Mono@master/data/216/21627.json
```

例如 person 为 `person/8138` 种田梨沙 访问地址为

```
https://cdn.jsdelivr.net/gh/czy0729/Bangumi-Mono@master/person/81/8138.json
```

### 自动更新 js 脚本

[待补充]

### 结构描述

```
{
  name: '', // 日文名
  nameCn: '', // 中文名
  cover: '', // 封面
  info: '', // 网页版简介
  detail: '', // API的内容详情
  voices: [], // 最近演出角色
  works: [], // 最近参与
  jobs: [] // 出演
}
```

character

```
{
  "name": "姫柊雪菜",
  "nameCn": "姬柊雪菜",
  "cover": "//lain.bgm.tv/pic/crt/m/04/bb/21627_crt_Z4iSY.jpg",
  "info": "<li><span>简体中文名: </span>姬柊雪菜</li><li><span>别名: </span>剑巫</li><li><span style=\"visibility:hidden;\">别名: </span>Swords Shaman</li><li><span style=\"visibility:hidden;\">别名: </span>Yukina Himeragi</li><li><span style=\"visibility:hidden;\">别名: </span>姫柊 雪菜</li><li><span style=\"visibility:hidden;\">别名: </span>ひめらぎ ゆきな</li><li><span style=\"visibility:hidden;\">别名: </span>Himeragi Yukina</li><li><span>性别: </span>女</li><li><span>生日: </span>1月7日</li><li><span>身高: </span>156cm</li><li><span>BWH: </span>B76-W55-H78-C60</li><li><span>年龄: </span>14</li>",
  "detail": "位于彩海学园中等部三年级。14岁的见习“剑巫”，狮子王机关的下属攻魔师。使用刻印“神格振动波驱动术式”的“七式突击降魔机枪”——“雪霞狼”（将魔力无效化的能力）。不擅长诅咒和占卜，但对于剑术和灵视很擅长。<br />之前在狮子王机关设立的神道女子学校“高神的森林&quot;就读。对于大城市常见的某些东西却有点陌生（比如夹娃娃机）不擅长坐飞机。<br />名义上受组织任命负责监视和抹杀“第四真祖”，实际上被狮子王机关送来做“第四真祖”——晓古城的妻子（本人并不知情）。",

  // 出演
  "jobs": [
    {
      "href": "/subject/83423",
      "name": "ストライク・ザ・ブラッド",
      "nameCn": "噬血狂袭",
      "cover": "//lain.bgm.tv/pic/cover/g/d3/8c/83423_fKd0D.jpg",
      "staff": "主角",
      "cast": "",
      "castHref": "",
      "castTag": "",
      "castCover": ""
    },
    {
      "href": "/subject/41741",
      "name": "ストライク・ザ・ブラッド",
      "nameCn": "噬血狂袭",
      "cover": "//lain.bgm.tv/pic/cover/g/ae/eb/41741_p64yd.jpg",
      "staff": "主角",
      "cast": "",
      "castHref": "",
      "castTag": "",
      "castCover": ""
    },
    {
      "href": "/subject/35579",
      "name": "嫁コレ",
      "nameCn": "新娘梦工厂",
      "cover": "//lain.bgm.tv/pic/cover/g/ea/b1/35579_GDMp7.jpg",
      "staff": "主角",
      "cast": "",
      "castHref": "",
      "castTag": "",
      "castCover": ""
    },
    {
      "href": "/subject/128322",
      "name": "ストライク・ザ・ブラッド ヴァルキュリアの王国篇",
      "nameCn": "噬血狂袭 女武神的王国篇",
      "cover": "//lain.bgm.tv/pic/cover/g/9d/02/128322_kTR62.jpg",
      "staff": "主角",
      "cast": "種田梨沙",
      "castHref": "/person/8138",
      "castTag": "CV",
      "castCover": "//lain.bgm.tv/pic/crt/s/07/06/8138_prsn_88jul.jpg"
    },
    {
      "href": "/subject/84944",
      "name": "電撃文庫 FIGHTING CLIMAX",
      "nameCn": "电击文库 格斗巅峰",
      "cover": "//lain.bgm.tv/pic/cover/g/cf/6f/84944_MFRrh.jpg",
      "staff": "主角",
      "cast": "種田梨沙",
      "castHref": "/person/8138",
      "castTag": "CV",
      "castCover": "//lain.bgm.tv/pic/crt/s/07/06/8138_prsn_88jul.jpg"
    },
    {
      "href": "/subject/146296",
      "name": "電撃文庫 FIGHTING CLIMAX IGNITION",
      "nameCn": "电击文库 巅峰格斗者再燃",
      "cover": "//lain.bgm.tv/pic/cover/g/3e/87/146296_v2mqq.jpg",
      "staff": "主角",
      "cast": "種田梨沙",
      "castHref": "/person/8138",
      "castTag": "CV",
      "castCover": "//lain.bgm.tv/pic/crt/s/07/06/8138_prsn_88jul.jpg"
    },
    {
      "href": "/subject/228714",
      "name": "电击文库：零境交错",
      "nameCn": "电击文库：零境交错",
      "cover": "//lain.bgm.tv/pic/cover/g/36/65/228714_W4czx.jpg",
      "staff": "主角",
      "cast": "",
      "castHref": "",
      "castTag": "",
      "castCover": ""
    },
    {
      "href": "/subject/67826",
      "name": "ストライク・ザ・ブラッド",
      "nameCn": "噬血狂袭",
      "cover": "//lain.bgm.tv/pic/cover/g/c0/f7/67826_oa7Xa.jpg",
      "staff": "主角",
      "cast": "種田梨沙",
      "castHref": "/person/8138",
      "castTag": "CV",
      "castCover": "//lain.bgm.tv/pic/crt/s/07/06/8138_prsn_88jul.jpg"
    },
    {
      "href": "/subject/182239",
      "name": "ストライク・ザ・ブラッド II",
      "nameCn": "噬血狂袭 II",
      "cover": "//lain.bgm.tv/pic/cover/g/43/d4/182239_v5d8x.jpg",
      "staff": "主角",
      "cast": "種田梨沙",
      "castHref": "/person/8138",
      "castTag": "CV",
      "castCover": "//lain.bgm.tv/pic/crt/s/07/06/8138_prsn_88jul.jpg"
    },
    {
      "href": "/subject/240037",
      "name": "ストライク・ザ・ブラッド III",
      "nameCn": "噬血狂袭 III",
      "cover": "//lain.bgm.tv/pic/cover/g/b6/f7/240037_750zZ.jpg",
      "staff": "主角",
      "cast": "種田梨沙",
      "castHref": "/person/8138",
      "castTag": "CV",
      "castCover": "//lain.bgm.tv/pic/crt/s/07/06/8138_prsn_88jul.jpg"
    }
  ]
}
```

person

```
{
  "name": "種田梨沙",
  "nameCn": "种田梨沙",
  "cover": "//lain.bgm.tv/pic/crt/m/07/06/8138_prsn_azY4i.jpg",
  "info": "<li><span>简体中文名: </span>种田梨沙</li><li><span>别名: </span>種田 梨沙</li><li><span style=\"visibility:hidden;\">别名: </span>たねだ りさ</li><li><span style=\"visibility:hidden;\">别名: </span>Taneda Risa</li><li><span style=\"visibility:hidden;\">别名: </span>seed君、たねちゃん</li><li><span>性别: </span>女</li><li><span>生日: </span>1988-07-12</li><li><span>血型: </span>A</li><li><span>身高: </span>153cm</li><li><span>出生地: </span>东京都</li><li><span>事务所: </span>大沢事務所</li><li><span>引用来源: </span>wiki</li>",
  "detail": "初中一年级的时候打算成为一名声优是因为《哈利·波特》的影响，想做有关系的工作。但中学、高中的时候禁止一切艺能活动，通过自学学习了表演的经验技术。<br />2007年，产生许多人气声优的‘智一・美树的广播大爆炸’一般应募进入，成为第9代的助理。与三上枝织同期。<br />2012年9月出演《来自新世界》，为首部配演主役的动画。<br />美术大学毕业，也取得高等学校美术教师资格。",

  // 最近演出角色
  "voices": [
    {
      "href": "/character/75278",
      "name": "ハーピー",
      "nameCn": "哈比",
      "cover": "//lain.bgm.tv/pic/crt/s/65/4c/75278_crt_zD0R3.jpg",
      "subjectHref": "/subject/300301",
      "subjectName": "ぷよぷよクロニクル",
      "subjectNameCn": "噗哟噗哟编年史",
      "staff": "客串",
      "subjectCover": "//lain.bgm.tv/pic/cover/g/cd/87/300301_M1bMv.jpg"
    },
    {
      "href": "/character/73282",
      "name": "桜原桃",
      "nameCn": "樱原桃",
      "cover": "//lain.bgm.tv/pic/crt/s/eb/3c/73282_crt_8RR28.jpg",
      "subjectHref": "/subject/262943",
      "subjectName": "俺を好きなのはお前だけかよ",
      "subjectNameCn": "喜欢本大爷的竟然就你一个？",
      "staff": "配角",
      "subjectCover": "//lain.bgm.tv/pic/cover/g/22/d7/262943_L1Vld.jpg"
    },
    {
      "href": "/character/72236",
      "name": "鹤",
      "nameCn": "瑞鹤",
      "cover": "//lain.bgm.tv/pic/crt/s/cc/11/72236_crt_NFo72.jpg",
      "subjectHref": "/subject/260677",
      "subjectName": "アズールレーン",
      "subjectNameCn": "碧蓝航线",
      "staff": "配角",
      "subjectCover": "//lain.bgm.tv/pic/cover/g/97/2a/260677_P5Z3f.jpg"
    }
  ],

  // 最近参与
  "works": [
    {
      "href": "/subject/295508",
      "name": "「ストライク・ザ・ブラッド」OVAシリーズ オリジナルサウンドトラック",
      "cover": "//lain.bgm.tv/pic/cover/g/1a/66/295508_z7QYp.jpg",
      "staff": "艺术家"
    },
    {
      "href": "/subject/295933",
      "name": "TVアニメ『ご注文はうさぎですか？？』バースデイソングシリーズ 全巻購入特典CD",
      "cover": "//lain.bgm.tv/pic/cover/g/45/02/295933_4WwwW.jpg",
      "staff": "艺术家"
    },
    {
      "href": "/subject/287444",
      "name": "ゾンビランドサガ フランシュシュ The Best",
      "cover": "//lain.bgm.tv/pic/cover/g/25/d3/287444_gjDR8.jpg",
      "staff": "艺术家"
    },
    {
      "href": "/subject/294237",
      "name": "プリンセスコネクト！Re:Dive PRICONNE CHARACTER SONG 10",
      "cover": "//lain.bgm.tv/pic/cover/g/38/d1/294237_aph9I.jpg",
      "staff": "艺术家"
    },
    {
      "href": "/subject/290833",
      "name": "しんがーそんぐぱやぽやメロディー",
      "cover": "//lain.bgm.tv/pic/cover/g/f2/c8/290833_eE5xt.jpg",
      "staff": "艺术家"
    }
  ]
}
```
