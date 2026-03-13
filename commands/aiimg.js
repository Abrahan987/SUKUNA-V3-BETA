import fetch from 'node-fetch'

export default {

  command: ['iaimg', 'dalle'],

  category: 'ai',

  run: async ({ client, m, text, command }) => {

    try {

      if (!text) {

        return m.reply(

`🎨 *Generador de imágenes IA*

Uso:

.${command} descripción | resolución(opcional)

Ejemplos:

• .${command} chica anime

• .${command} dragón de fuego | 2

Resoluciones disponibles:

1 → 1:1

2 → 16:9

3 → 9:16`

        )

      }

      const parts = text.split('|').map(v => v.trim())

      const prompt = parts[0]

      const ratioInput = parts[1]

      const ratioList = {

        '1': '1:1',

        '2': '16:9',

        '3': '9:16'

      }

      let ratio = ratioList[ratioInput]

      if (!ratio) {

        const available = Object.values(ratioList)

        ratio = available[Math.floor(Math.random() * available.length)]

      }

      await m.reply('🧠 Generando imagen...\n⏳ Espera un momento')

      const endpoint =

        `https://api.nekolabs.web.id/image-generation/illustrious/me-v6` +

        `?prompt=${encodeURIComponent(prompt)}` +

        `&ratio=${encodeURIComponent(ratio)}`

      const request = await fetch(endpoint)

      const data = await request.json()

      if (!data?.success || !data?.result) {

        throw new Error('La API no devolvió una imagen válida')

      }

      await client.sendMessage(

        m.chat,

        {

          image: { url: data.result },

          caption:

`✨ *Imagen generada con IA*

🖌️ Prompt: ${prompt}

📐 Ratio: ${ratio}

${dev}`

        },

        { quoted: m }

      )

    } catch (error) {

      console.error(error)

      m.reply('❌ No se pudo generar la imagen, intenta nuevamente.')

    }

  }

}