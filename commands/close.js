export default {

  command: ['close'],

  category: 'grupo',

  isAdmin: true,

  botAdmin: true,

  run: async ({ client, m }) => {

    try {

      const metadata = await client.groupMetadata(m.chat)

      const isClosed = metadata?.announce

      if (isClosed) {

        return m.reply('✧ El grupo ya se encuentra cerrado.')

      }

      await client.groupSettingUpdate(m.chat, 'announcement')

      return client.reply(

        m.chat,

        '✿ El grupo fue cerrado correctamente.',

        m

      )

    } catch (error) {

      console.error(error)

      return client.reply(m.chat, msgglobal, m)

    }

  }

}