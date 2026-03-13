import yts from 'yt-search'
import fetch from 'node-fetch'
import sharp from 'sharp'
import axios from 'axios'

export default {
  command: ['play', 'mp3', 'playaudio', 'ytmp3'],
  category: 'downloader',

  run: async ({ client, m, args, command, text }) => {
    try {
      if (!text.trim()) {
        return client.reply(m.chat, '✎ Ingresa el nombre de la música o una URL de YouTube.', m)
      }

      const isYTUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/)|youtu\.be\/).+$/i.test(url)

      const esURL = isYTUrl(text)
      let url, title, videoInfo

      if (!esURL) {
        const search = await yts(text)
        if (!search.all.length) return m.reply('✎ No se encontraron resultados.')

        videoInfo = search.all[0]
        ;({ title, url } = videoInfo)

        const vistas = (videoInfo.views || 0).toLocaleString()
        const canal = videoInfo.author?.name || 'Desconocido'
        const timestamp = videoInfo.duration?.toString() || 'Desconocido'
        const ago = videoInfo.ago || 'Desconocido'

        const infoMessage = `
*𖹭.╭╭ִ╼ׅ࣪ﮩ٨ـﮩ𝗒𝗈𝗎𝗍𝗎𝗏𝖾-𝗉꯭𝗅꯭𝖺꯭𝗒ﮩ٨ـﮩׅ╾࣪╮╮.𖹭*
> ♡ *Título:* ${title || 'Desconocido'}
> ♡ *Duración:* ${timestamp}
> ♡ *Vistas:* ${vistas}
> ♡ *Canal:* ${canal}
> ♡ *Publicado:* ${ago}
`

        let thumb
        try {
          thumb = (await client.getFile(videoInfo.thumbnail))?.data
        } catch {}

        await client.sendMessage(
          m.chat,
          thumb ? { image: thumb, caption: infoMessage } : { text: infoMessage },
          { quoted: m }
        )

      } else {
        url = text
        try {
          videoInfo = await yts({
            videoId: new URL(url).searchParams.get('v') || url.split('/').pop()
          })
          ;({ title } = videoInfo)
        } catch {
          title = 'Audio'
        }
      }

      const api = `https://rest.apicausas.xyz/api/v1/descargas/youtube?apikey=causa-ee5ee31dcfc79da4&url=${encodeURIComponent(url)}&type=audio`
      const { data: res } = await axios.get(api)

      if (!res.status || !res.data?.download?.url) {
        return m.reply('✎ No se pudo obtener el audio.')
      }

      const dl = res.data.download.url
      const finalTitle = res.data.title || title || 'audio'
      const thumbnailToProcess = res.data.thumbnail || videoInfo?.thumbnail

      let thumbBuffer = null

      if (thumbnailToProcess) {
        try {
          const response = await fetch(thumbnailToProcess)
          const arrayBuffer = await response.arrayBuffer()

          thumbBuffer = await sharp(Buffer.from(arrayBuffer))
            .resize(320, 180)
            .jpeg({ quality: 80 })
            .toBuffer()
        } catch {}
      }

      await client.sendMessage(
        m.chat,
        {
          audio: { url: dl },
          mimetype: 'audio/mpeg',
          fileName: `${finalTitle}.mp3`,
          jpegThumbnail: thumbBuffer,
          ptt: false
        },
        { quoted: m }
      )

    } catch (error) {
      m.reply(`Error:\n${error.message}`)
    }
  }
}
