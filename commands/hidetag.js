export default {
  command: ['hidetag', 'tag'],
  category: 'grupo',
  isAdmin: true,

  run: async ({ client, m, args }) => {
    try {

      if (!m.isGroup) return m.reply('✧ Este comando solo funciona en grupos.')

      const metadata = await client.groupMetadata(m.chat).catch(() => null)
      const members = metadata?.participants || []

      const mentions = members
        .map(v => v.jid || v.id || v.lid || v.phoneNumber)
        .filter(Boolean)
        .map(v => client.decodeJid(v))

      const quoted = m.quoted ? m.quoted : m
      const msg = quoted.msg || quoted.message || quoted

      const inputText = args.join(' ')
      const quotedText =
        quoted?.text ||
        quoted?.caption ||
        quoted?.body ||
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        ''

      const text = inputText || quotedText

      if (!quoted && !text) {
        return m.reply('✧ Escribe algo o responde a un mensaje.')
      }

      let type = ''
      if (msg?.mimetype) type = msg.mimetype
      else if (msg?.imageMessage) type = 'image'
      else if (msg?.videoMessage) type = 'video'
      else if (msg?.stickerMessage) type = 'sticker'
      else if (msg?.audioMessage) type = 'audio'

      const sendOpt = { quoted: null, mentions }

      if (/image/.test(type)) {
        const media = await quoted.download()
        return client.sendMessage(
          m.chat,
          text ? { image: media, caption: text, ...sendOpt } : { image: media, ...sendOpt }
        )
      }

      if (/video/.test(type)) {
        const media = await quoted.download()
        return client.sendMessage(
          m.chat,
          text
            ? { video: media, mimetype: 'video/mp4', caption: text, ...sendOpt }
            : { video: media, mimetype: 'video/mp4', ...sendOpt }
        )
      }

      if (/audio/.test(type)) {
        const media = await quoted.download()
        return client.sendMessage(
          m.chat,
          { audio: media, mimetype: 'audio/mp4', fileName: 'tag.mp3', ...sendOpt }
        )
      }

      if (/sticker/.test(type)) {
        const media = await quoted.download()
        return client.sendMessage(
          m.chat,
          { sticker: media, ...sendOpt }
        )
      }

      if (!text) {
        return m.reply('✧ No hay texto para enviar.')
      }

      await client.sendMessage(
        m.chat,
        { text, mentions },
        { quoted: null }
      )

    } catch {
      m.reply('✧ No se pudo ejecutar el comando.')
    }
  }
              }
