import fetch from 'node-fetch'

export default {

  command: ['tiktok', 'tt'],

  category: 'downloader',

  run: async ({ client, m, args }) => {

    try {

      const link = args?.[0]

      if (!link || !/tiktok\.com/i.test(link)) {

        return m.reply(

          '✧ Envía un enlace válido de TikTok.\n\nEjemplo:\n*.tiktok* https://vt.tiktok.com/...'

        )

      }

      const endpoint =

        `https://anabot.my.id/api/download/tiktok?url=${encodeURIComponent(link)}&apikey=freeApikey`

      const req = await fetch(endpoint)

      if (!req.ok) throw new Error('API no respondió correctamente')

      const data = await req.json()

      const info = data?.data?.result

      if (!data?.success || !info) {

        return m.reply('✧ No fue posible obtener el video. Intenta con otro enlace.')

      }

      const videoURL = info.nowatermark || info.video

      if (!videoURL) {

        return m.reply('✧ No se encontró un archivo de video disponible.')

      }

      const caption = `

*⟡ TikTok Downloader*

✦ Usuario: ${info.username || 'Desconocido'}

✦ Descripción: ${info.description || 'Sin descripción'}

`.trim()

      await client.sendMessage(

        m.chat,

        {

          video: { url: videoURL },

          caption

        },

        { quoted: m }

      )

    } catch (err) {

      console.error(err)

      m.reply('✧ Ocurrió un error al intentar descargar el video.')

    }

  }

}