import { writeFile, appendFile } from 'fs/promises'
import axios from 'axios'
import rssParser from 'rss-parser'

const init = async () => {
  const parser = new rssParser()
  // const chocale = await parser.parseURL('https://chocale.cl/feed/')
  // const rnm = await parser.parseURL('https://radionuevomundo.cl/feed/')
  // const feeds = [chocale, rnm]

  // console.log('Chocale', chocale.items.length)
  // chocale.items.forEach((item) => {
  //   // console.log(Object.keys(item))
  //   console.log('Noticia:')
  //   console.log(item.title)
  //   console.log()
  //   console.log()
  //   console.log('Contenido:')
  //   console.log(item.content)
  //   console.log()
  //   console.log()
  //   console.log()
  // })

  const chocale = await parser.parseURL('https://chocale.cl/feed/')
  const rnm = await parser.parseURL('https://radionuevomundo.cl/feed/')
  const pl = await parser.parseURL('https://www.paislobo.cl/feeds/posts/default')
  const laNacion = await parser.parseURL('https://www.lanacion.cl/feed/')
  const laTercera = await parser.parseURL('https://www.latercera.com/arcio/rss/')
  const df = await parser.parseURL('https://www.df.cl/noticias/site/list/port/rss.xml')
  const cooperativa = await parser.parseURL(
    'https://www.cooperativa.cl/noticias/site/tax/port/all/rss____1.xml',
  )
  const biobio = await parser.parseURL('https://feeds.feedburner.com/radiobiobio/NNeJ')
  const ciper = await parser.parseURL('https://ciperchile.cl/feed/')
  const t13 = await parser.parseURL(
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCsRnhjcUCR78Q3Ud6OXCTNg',
  )
  const feeds = [
    // [
    //   {
    //     title: 'La Nación',
    //     items: laNacion.items,
    //   },
    //   {
    //     title: 'La Tercera',
    //     items: laTercera.items,
    //   },
    //   {
    //     title: 'Diario Financiero',
    //     items: df.items,
    //   },
    // ],
    // [
    //   {
    //     title: 'Chocale',
    //     items: chocale.items,
    //   },
    //   {
    //     title: 'Radio Nuevo Mundo',
    //     items: rnm.items,
    //   },
    //   {
    //     title: 'Cooperativa',
    //     items: cooperativa.items,
    //   },
    //   {
    //     title: 'BioBio',
    //     items: biobio.items,
    //   },
    // ],
    // [
    //   {
    //     title: 'Pais Lobo',
    //     items: pl.items,
    //   },
    // ],
    [
      {
        title: 'La Nación',
        items: laNacion.items,
      },
    ],
    [
      {
        title: 'La Tercera',
        items: laTercera.items,
      },
    ],
    [
      {
        title: 'Diario Financiero',
        items: df.items,
      },
    ],
    [
      {
        title: 'Chocale',
        items: chocale.items,
      },
    ],
    [
      {
        title: 'Radio Nuevo Mundo',
        items: rnm.items,
      },
    ],
    [
      {
        title: 'Cooperativa',
        items: cooperativa.items,
      },
    ],
    [
      {
        title: 'BioBio',
        items: biobio.items,
      },
    ],
    [
      {
        title: 'Pais Lobo',
        items: pl.items,
      },
    ],
    [
      {
        title: 'CIPER Chile',
        items: ciper.items,
      },
    ],
    [
      {
        title: 'T13',
        items: t13.items,
      },
    ],
  ]
  const texts: any[] = []
  const date = new Date().toISOString().replace(/\:/g, '_').split('.')[0]
  let total = 0
  feeds.forEach((block: any) => {
    let text = ''
    block.forEach((feed: any) => {
      // text += `Fuente: ${feed.title}. Total: ${feed.items.length}\n\n\n`
      console.log(`Fuente: ${feed.title}. Total: ${feed.items.length}`)
      total += feed.items.length
      feed.items.forEach((item: any) => {
        text += '******************************************************\n\n'
        text += `Fuente: ${feed.title}.\n`
        text += `Noticia:\n`
        text += `${item.title}\n`
        text += `Link:\n`
        text += `${item.link}\n`
        text += `Descripción:\n`
        text += `${item.content ?? ''}\n\n`
        // text += '******************************************************\n\n'
      })
    })
    text += '******************************************************\n'
    texts.push(text)
  })
  console.log(`Total: ${total}`)
  for (let i = 0; i < texts.length; i++) {
    await writeFile(`noticias-${i + 1}-${date}.txt`, texts[i])
  }
}

init()
