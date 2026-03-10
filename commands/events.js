import chalk from 'chalk'
import moment from 'moment-timezone'

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
  //  console.log(anu)
    try {
      const metadata = await client.groupMetadata(anu.id)
      const chat = global.db.data.chats[anu.id]
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot

      const now = new Date()
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }))
      const tiempo = colombianTime.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/,/g, '')
      const tiempo2 = moment.tz('America/Bogota').format('hh:mm A')

      const memberCount = metadata.participants.length

      for (const jid of anu.participants) {
        const phone = jid.split('@')[0]
        const pp = await client.profilePictureUrl(jid, 'image').catch(_ => 'https://cdn.sockywa.xyz/files/1755559736781.jpeg')

        const fakeContext = {
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.db.data.settings[botId].id,
              serverMessageId: '0',
              newsletterName: global.db.data.settings[botId].nameid
            },
            externalAdReply: {
              title: global.db.data.settings[botId].namebot,
              body: global.dev,
              mediaUrl: null,
              description: null,
              previewType: 'PHOTO',
              thumbnailUrl: global.db.data.settings[botId].icon,
              sourceUrl: global.db.data.settings[botId].link,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }

        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          const caption = `
╭┄┈┈┈֗┄፞┈֯┈፞┈֗┈┈┄┈─⟢ࣰ
┊「 *ᗷіᥱᥒ᥎ᥱᥒіძ᥆ ˃͈◡˂͈* 」
┊ᨏᨐᨓᨒᨓᨐᨏᨕ
┊  *Usuario ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊╌ ╌ ╌ ╴⵿⋱ ּ ׅ⃞💐ׅ᪲⃞ ּ ⋰⵿╶๋݄╌ ╌ ╌⍣⃝
┊➤ *Usa /menu para ver los comandos.*
┊➤ *Ahora somos ${memberCount} miembros.*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯`
          await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })
        }

        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          const caption = `
╭ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄─ׂ
┆──〘 𝐀𝐝𝐢𝐨𝐬𝐢𝐭𝐨 ^^  〙───
┆┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄─ׂ
┆ *_☠ Se fue ${phone}*
┆ *_Que dios lo bendiga️_* \n┆ *_Y lo atropelle un tren 😇_*
┊ _*Ahora somos ${memberCount} miembros.*_
╰─ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄ׂ`
          await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })
        }

        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, {
            text: `「✎」 *@${phone}* ha sido promovido a Administrador por *@${usuario.split('@')[0]}.*`,
            mentionedJid: [jid, usuario]
          })
        }

        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, {
            text: `「✎」 *@${phone}* ha sido degradado de Administrador por *@${usuario.split('@')[0]}.*`,
            mentionedJid: [jid, usuario]
          })
        }
      }
    } catch (err) {
      console.log(chalk.gray(`[ BOT  ]  → ${err}`))
    }
  })
}
