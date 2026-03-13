import axios from 'axios'

export default {

  command: ['claude'],

  category: 'ai',

  run: async ({ client, m, text }) => {

    try {

      if (!text) {

        return m.reply('✧ Escribe una pregunta para consultar con Claude.')

      }

      const endpoint =

        `${api.url}/ai/claude?text=${encodeURIComponent(text)}&key=${api.key}`

      const loadingMsg = '🧠 Claude está generando una respuesta...'

      const { key } = await client.sendMessage(

        m.chat,

        { text: loadingMsg },

        { quoted: m }

      )

      const request = await axios.get(endpoint)

      const data = request.data

      if (!data?.status || !data?.answer) {

        throw new Error('La API devolvió una respuesta inválida')

      }

      const response = data.answer

      await client.sendMessage(

        m.chat,

        {

          text: response,

          edit: key

        }

      )

    } catch (err) {

      await m.reply(`Error :: ${err.message || err}`)

    }

  }

}