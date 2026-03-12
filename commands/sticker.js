import fs from 'fs'

export default {
  command: ['sticker', 's'],
  category: 'utils',

  run: async ({ client, m }) => {
    try {

      const userData = global.db.data.users[m.sender] || {}
      const chatUsers = global.db.data.chats[m.chat].users || {}

      const packname = userData.metadatos ?? 'SUKUNA V3'
      const author = userData.metadatos2 ?? `Usuario: @${userData.name} \n SUKUNA V3 BY ABRAHAN-M`

      const message = m.quoted ? m.quoted : m
      const msg = message.msg || message
      const mime = msg.mimetype || ''

      if (!mime.match(/image|video/)) {
        return m.reply('✧ Responde o envía una imagen o video para hacer sticker.')
      }

      const buffer = await message.download()
      let stickerFile

      switch (true) {

        case /image/.test(mime):
          stickerFile = await client.sendImageAsSticker(
            m.chat,
            buffer,
            m,
            { packname, author }
          )
        break

        case /video/.test(mime):

          if (msg.seconds > 20) {
            return m.reply('El video es muy largo (máx 20s).')
          }

          stickerFile = await client.sendVideoAsSticker(
            m.chat,
            buffer,
            m,
            { packname, author }
          )
        break
      }

      if (stickerFile) fs.unlinkSync(stickerFile)

    } catch (err) {
      m.reply('❌ Error:\n' + err)
    }
  }
}
