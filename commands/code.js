import { startSubBot } from '../lib/subs.js'

import fs from 'fs'

import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

let activeRequests = {}

export default {

  command: ['code'],

  category: 'socket',

  run: async ({ client, m, args, command }) => {

    try {

      const user = global.db.data.users[m.sender]

      const cooldown = 120000

      if (Date.now() - user.Subs < cooldown) {

        const remaining = cooldown - (Date.now() - user.Subs)

        return client.reply(

          m.chat,

          `⏳ Espera *${formatTime(remaining)}* antes de generar otro código.`,

          m

        )

      }

      const subsDir = path.join(__dirname, '../../Sessions/Subs')

      const totalSubs = fs.existsSync(subsDir)

        ? fs.readdirSync(subsDir).filter(dir =>

            fs.existsSync(path.join(subsDir, dir, 'creds.json'))

          ).length

        : 0

      const limit = 4

      if (totalSubs >= limit) {

        return client.reply(

          m.chat,

          '⚠️ El servidor ya alcanzó el máximo de Sub-Bots disponibles.',

          m

        )

      }

      activeRequests[m.sender] = true

      const phone =

        args[0]?.replace(/\D/g, '') ||

        m.sender.split('@')[0]

      const message = `╭━━〔 *VINCULACIÓN DE SUB-BOT* 〕━━⬣

┃

┃ 🔐 *Método:* Código de emparejamiento

┃ 📱 *Número:* ${phone}

┃

┃ Sigue estos pasos para conectar:

┃

┃ 1️⃣ Abre WhatsApp

┃ 2️⃣ Ve a *Dispositivos vinculados*

┃ 3️⃣ Presiona *Vincular dispositivo*

┃ 4️⃣ Elige *Usar número de teléfono*

┃

┃ ⏱️ El código solo funcionará

┃ para el número que lo solicitó.

┃

╰━━━━━━━━━━━━━━━━━━⬣`

      const button = [

        {

          name: "cta_copy",

          buttonParamsJson: JSON.stringify({

            display_text: "📋 Copiar número",

            id: phone,

            copy_code: phone

          })

        }

      ]

      await client.sendMessage(

        m.chat,

        {

          text: message,

          footer: "Sistema de Sub-Bots",

          buttons: button,

          headerType: 1

        },

        { quoted: m }

      )

      const useCode = command === 'code'

      await startSubBot(

        m,

        client,

        message,

        useCode,

        phone,

        m.chat,

        activeRequests,

        true

      )

      user.Subs = Date.now()

    } catch (err) {

      console.error(err)

      client.reply(m.chat, msgglobal, m)

    }

  }

}

function formatTime(ms) {

  const sec = Math.floor(ms / 1000)

  const min = Math.floor(sec / 60)

  const seconds = sec % 60

  if (min > 0) {

    return `${min} minuto${min > 1 ? 's' : ''}, ${seconds} segundo${seconds !== 1 ? 's' : ''}`

  }

  return `${seconds} segundo${seconds !== 1 ? 's' : ''}`

}