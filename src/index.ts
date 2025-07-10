import 'dotenv/config'
import rssParser from 'rss-parser'
// @ts-ignore
import { CronJob } from 'cron'
import { v4 as uuidv4 } from 'uuid'

import { sql } from './utils/db'
import { anthropic } from './utils/anthropic'

const init = async () => {
  const parser = new rssParser()

  // const chocale = await parser.parseURL('https://chocale.cl/feed/')
  // const rnm = await parser.parseURL('https://radionuevomundo.cl/feed/')
  // const pl = await parser.parseURL('https://www.paislobo.cl/feeds/posts/default')
  // const laNacion = await parser.parseURL('https://www.lanacion.cl/feed/')
  // const laTercera = await parser.parseURL('https://www.latercera.com/arcio/rss/')
  // const df = await parser.parseURL('https://www.df.cl/noticias/site/list/port/rss.xml')
  // const cooperativa = await parser.parseURL(
  //   'https://www.cooperativa.cl/noticias/site/tax/port/all/rss____1.xml',
  // )
  // const biobio = await parser.parseURL('https://feeds.feedburner.com/radiobiobio/NNeJ')
  // const ciper = await parser.parseURL('https://ciperchile.cl/feed/')
  // const t13 = await parser.parseURL(
  //   'https://www.youtube.com/feeds/videos.xml?channel_id=UCsRnhjcUCR78Q3Ud6OXCTNg',
  // )
  // const feeds = [
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
  //   {
  //     title: 'Pais Lobo',
  //     items: pl.items,
  //   },
  //   {
  //     title: 'CIPER Chile',
  //     items: ciper.items,
  //   },
  //   {
  //     title: 'T13',
  //     items: t13.items,
  //   },
  // ]
  // const texts: any[] = []
  // const date = new Date().toISOString().replace(/\:/g, '_').split('.')[0]
  // let total = 0
  // feeds.forEach((feed: any) => {
  //   let text = ''
  //   console.log(`Fuente: ${feed.title}. Total: ${feed.items.length}`)
  //   total += feed.items.length
  //   feed.items.forEach((item: any) => {
  //     text += '******************************************************\n\n'
  //     text += `Fuente: ${feed.title}.\n`
  //     text += `Noticia:\n`
  //     text += `${item.title}\n`
  //     text += `Link:\n`
  //     text += `${item.link}\n`
  //     text += `Descripción:\n`
  //     text += `${item.content ?? ''}\n\n`
  //   })
  //   text += '******************************************************\n'
  //   texts.push(text)
  // })
  // console.log(`Total: ${total}`)
  // for (let i = 0; i < texts.length; i++) {
  //   await writeFile(`noticias-${i + 1}-${date}.txt`, texts[i])
  // }

  // const chocale = await parser.parseURL('https://chocale.cl/feed/')
  // console.log(chocale.items.length)
}

const job = new CronJob((process.env.CRON_SCHEDULE as string) ?? '22 * * * *', async () => {
  const parser = new rssParser()

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
    {
      title: 'La Nación',
      items: laNacion.items,
    },
    // {
    //   title: 'La Tercera',
    //   items: laTercera.items,
    // },
    // {
    //   title: 'Diario Financiero',
    //   items: df.items,
    // },
    {
      title: 'Chocale',
      items: chocale.items,
    },
    {
      title: 'Radio Nuevo Mundo',
      items: rnm.items,
    },
    {
      title: 'Cooperativa',
      items: cooperativa.items,
    },
    {
      title: 'BioBio',
      items: biobio.items,
    },
    {
      title: 'Pais Lobo',
      items: pl.items,
    },
    {
      title: 'CIPER Chile',
      items: ciper.items,
    },
    {
      title: 'T13',
      items: t13.items,
    },
  ]
  let reviewedNewsCounter = 0
  let aIReviewedNewsCounter = 0
  let positiveNewsCounter = 0
  let skippedNewsCounter = 0
  let isPositiveNullCounter = 0
  let newsAlreadyInDb = 0
  for (const feed of feeds) {
    console.log(`>>> Fuente: ${feed.title}. Total: ${feed.items.length}`)
    reviewedNewsCounter += feed.items.length
    for (let i = 0; i < feed.items.length; i += 1) {
      const item: any = feed.items[i]

      if (
        [
          'Lo que debes saber a esta hora de la tarde',
          'Resumen informativo',
          'Rating del',
          'Nuevos sonidos',
          'Reporte Deportivo',
          'Marcador Virtual',
        ].some((phrase) => item.title.toLowerCase().includes(phrase.toLowerCase()))
      ) {
        console.log('---\n--- Noticia saltada.')
        console.log(`Noticia: ${item.title}\n---`)
        skippedNewsCounter += 1
        continue
      }

      let query
      try {
        query = await sql`
          SELECT * FROM news WHERE link = ${item.link}
        `
      } catch (e: any) {
        console.log(e)
        console.log('---\n--- Hubo un error al consultar en DB.')
        console.log(`Noticia: ${item.title}\n---`)
        continue
      }
      if (query.length > 0) {
        newsAlreadyInDb += 1
        continue
      }

      let ai
      try {
        ai = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Considera la siguiente noticia "${item.title}". Responde en un JSON stringify con 2 atributos. "isPositive" es un boolean si la noticia es positiva y está relacionada con humanos. "categories" es un arreglo, en minúsculas un conjunto de categorías a las que pertenece la noticia`,
            },
          ],
        })
        aIReviewedNewsCounter += 1
      } catch (e: any) {
        console.log(e)
        console.log('---\n--- Hubo un error con Anthropic.')
        console.log(`Noticia: ${item.title}\n---`)
        continue
      }

      // @ts-ignore
      if (ai.content[0].text.includes('"isPositive": null')) {
        console.log('---\n--- La noticia en isPositive es nula.')
        console.log(`Noticia: ${item.title}\n---`)
        isPositiveNullCounter += 1
        continue
      }

      let aiResult
      try {
        // @ts-ignore
        aiResult = JSON.parse(ai.content[0].text.replace(/```json\n|\n```/g, ''))
      } catch (e: any) {
        console.log(e)
        // @ts-ignore
        console.log(ai.content[0].text)
        console.log('---\n--- Hubo un error con la respuesta de Anthropic.')
        console.log(`Noticia: ${item.title}\n---`)
        continue
      }
      if (!aiResult.isPositive) {
        continue
      }

      console.log('*', item.title)

      try {
        await sql`
          INSERT INTO news
            (
              id, source, title, is_reviewed, is_selected, link, date,
              categories, content, created_at
            )
          VALUES
            (
              ${uuidv4()}, ${feed.title}, ${item.title}, false, false, ${item.link}, ${item.isoDate},
              ${aiResult.categories}, ${item.content ?? ''}, ${new Date().toISOString()}
            )
        `
        positiveNewsCounter += 1
      } catch (e: any) {
        console.log(e)
        console.log('---\n--- Hubo un error al insertar en DB.\n---')
        continue
      }
    }
  }
  console.log('Noticias totales:', reviewedNewsCounter)
  console.log('Noticias saltadas según texto:', skippedNewsCounter)
  console.log('Noticias ya en DB:', newsAlreadyInDb)
  console.log('Noticias revisadas con IA:', aIReviewedNewsCounter)
  console.log('Noticias positivas agregadas:', positiveNewsCounter)
  console.log('Noticias con isPositive null:', isPositiveNullCounter)
})

// init()
job.start()
