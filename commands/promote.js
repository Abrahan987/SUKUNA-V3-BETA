 export default {

  command: ['promote'],

  category: 'grupo',

  isAdmin: true,

  botAdmin: true,

  run: async ({ client, m }) => {

    try {

      const mention = m.mentionedJid?.[0]

      const quoted = m.quoted?.sender

      const target = mention || quoted

      if (!target) {

        return m.reply('✧ Menciona o responde al usuario que deseas convertir en administrador.')

      }

      const metadata = await client.groupMetadata(m.chat)

      const user = metadata.participants.find(

        p => p.id === target || p.jid === target || p.phoneNumber === target || p.lid === target

      )

      if (user?.admin) {

        return client.sendMessage(

          m.chat,

          {

            text: `✧ @${target.split('@')[0]} ya es administrador.`,

            mentions: [target]

          },

          { quoted: m }

        )

      }

      await client.groupParticipantsUpdate(m.chat, [target], 'promote')

      await client.sendMessage(

        m.chat,

        {

          text: `👑 @${target.split('@')[0]} ahora es administrador del grupo.`,

          mentions: [target]

        },

        { quoted: m }

      )

    } catch (err) {

      console.error(err)

      m.reply(msgglobal)

    }

  }

}