 import fetch from 'node-fetch'

export default {

  command: ['instagram', 'ig'],

  category: 'downloader',

  run: async ({ client, m, args }) => {

    try {

      const link = args?.[0]

      if (!link) {

        return m.reply('✧ Debes enviar un enlace de Instagram.')

      }

      if (!/instagram\.com\/(p|reel|share|tv)\//i.test(link)) {

        return m.reply('✧ El enlace no parece ser una publicación válida de Instagram.')

      }

      const endpoint = `${api.url}/dl/instagram?url=${encodeURIComponent(link)}&key=${api.key}`

      const req = await fetch(endpoint)

      const data = await req.json()

      const info = data?.data

      if (!data?.status || !info?.dl) {

        return client.reply(m.chat, '✧ No fue posible obtener el contenido.', m)

      }

      const title = info.title || 'Publicación'

      const likes = info.like || '0'

      const comments = info.comment || '0'

      const mediaType = info.type || 'video'

      const download = info.dl

      const caption = `

*⟡ Instagram Downloader*

✦ Título: ${title}

✦ Likes: ${likes}

✦ Comentarios: ${comments}

✦ Tipo: ${mediaType}

🔗 ${link}

`.trim()

      await client.sendMessage(

        m.chat,

        {

          [mediaType]: { url: download },

          caption

        },

        { quoted: m }

      )

    } catch (err) {

      // console.error(err)

      await client.reply(m.chat, msgglobal, m)

    }

  }

}