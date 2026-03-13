 import { igdl } from 'ruhend-scraper'

export default {
  command: ['fb', 'facebook'],
  category: 'downloader',

  run: async ({ client, m, args }) => {
    try {

      const link = args?.[0]

      if (!link) {
        return m.reply('✧ Debes enviar un enlace de Facebook.')
      }

      if (!/facebook\.com|fb\.watch|video\.fb\.com/i.test(link)) {
        return m.reply('✧ El enlace enviado no parece ser de Facebook.')
      }

      await client.sendMessage(m.chat, {
        react: { text: '💜', key: m.key }
      })

      m.reply('✧ Descargando el video de Facebook...')

      const response = await igdl(link)
      const videos = response?.data || []

      if (!videos.length) {
        return m.reply('✧ No se encontraron formatos disponibles.')
      }

      // Selección de calidad
      let selected =
        videos.find(v => /720/.test(v.resolution)) ||
        videos.find(v => /360/.test(v.resolution)) ||
        videos[0]

      if (!selected?.url) {
        return m.reply('✧ No fue posible obtener el video.')
      }

      const caption = `
*⟡ Facebook Downloader*

✦ Enlace:
${link}
`.trim()

      await client.sendMessage(
        m.chat,
        {
          video: { url: selected.url },
          mimetype: 'video/mp4',
          fileName: 'facebook.mp4',
          caption
        },
        { quoted: m }
      )

    } catch (err) {
      m.reply('✧ Ocurrió un error al descargar el video.')
      console.error(err)
    }
  }
}