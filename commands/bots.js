 import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['bots', 'sockets'],
  category: 'socket',

  run: async ({ client, m }) => {
    try {

      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const settings = global.db.data.settings[botId] || {}

      const banner = settings.icon
      const botname = settings.namebot || 'Bot'

      const chat = m.chat

      const metadata = m.isGroup
        ? await client.groupMetadata(chat).catch(() => null)
        : null

      const participants =
        metadata?.participants?.map(p =>
          p.phoneNumber || p.jid || p.lid || p.id
        ) || []

      const mainBot = global.client.user.id.split(':')[0] + '@s.whatsapp.net'

      const subsPath = path.join(__dirname, '../../Sessions/Subs')

      const getSubs = () => {
        if (!fs.existsSync(subsPath)) return []
        return fs.readdirSync(subsPath)
          .filter(dir =>
            fs.existsSync(path.join(subsPath, dir, 'creds.json'))
          )
          .map(v => v.replace(/\D/g, ''))
      }

      const subs = getSubs()

      const mentions = []
      const ownerList = []
      const subList = []

      const addBot = (num, type) => {
        const jid = num + '@s.whatsapp.net'

        if (!participants.includes(jid)) return

        mentions.push(jid)

        const data = global.db.data.settings[jid] || {}
        const name = data.namebot2 || 'Bot'

        const line = `• ${type} › *${name}* (@${num})`

        if (type === 'Owner') ownerList.push(line)
        else subList.push(line)
      }

      const ownerExists = !!global.db.data.settings[mainBot]

      if (ownerExists) {
        const ownerNum = mainBot.split('@')[0]
        addBot(ownerNum, 'Owner')
      }

      subs.forEach(num => addBot(num, 'Sub'))

      const totalBots = (ownerExists ? 1 : 0) + subs.length
      const botsInGroup = ownerList.length + subList.length

      let msg = `╭─〔 *SISTEMA DE SOCKETS* 〕─⬣\n`
      msg += `│ 🤖 Bots registrados: *${totalBots}*\n`
      msg += `│ 🌐 Bots en este grupo: *${botsInGroup}*\n`
      msg += `╰────────────────⬣\n\n`

      if (ownerList.length) {
        msg += `👑 *BOT PRINCIPAL*\n`
        msg += ownerList.join('\n') + '\n\n'
      }

      if (subList.length) {
        msg += `⚡ *SUB-BOTS*\n`
        msg += subList.join('\n') + '\n'
      }

      await client.sendMessage(
        chat,
        {
          text: msg.trim(),
          contextInfo: {
            mentionedJid: mentions,
            externalAdReply: {
              title: botname,
              body: dev,
              thumbnailUrl: banner,
              sourceUrl: settings.api,
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
        },
        { quoted: m }
      )

    } catch (err) {
      console.error(err)
      client.reply(m.chat, msgglobal, m)
    }
  }
}