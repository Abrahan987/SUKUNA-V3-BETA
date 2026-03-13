 export default {

  command: ['demote'],

  category: 'grupo',

  isAdmin: true,

  botAdmin: true,

  run: async ({ client, m }) => {

    try {

      const mention = m.mentionedJid?.[0]

      const quoted = m.quoted?.sender

      const target = mention || quoted

      if (!target) {

        return m.reply('✧ Menciona o responde al administrador que deseas degradar.')

      }

      const metadata = await client.groupMetadata(m.chat)

      const participant = metadata.participants.find(

        p => p.id === target || p.jid === target || p.phoneNumber === target || p.lid === target

      )

      if (!participant?.admin) {

        return client.sendMessage(

          m.chat,

          {

            text: `✧ @${target.split('@')[0]} no es administrador del grupo.`,

            mentions: [target]

          },

          { quoted: m }

        )

      }

      if (target === metadata.owner) {

        return m.reply('✧ No puedes degradar al creador del grupo.')

      }

      if (target === client.user.id) {

        return m.reply('✧ No puedes quitarle el admin al bot.')

      }

      await client.groupParticipantsUpdate(m.chat, [target], 'demote')

      await client.sendMessage(

        m.chat,

        {

          text: `⚠️ @${target.split('@')[0]} ya no es administrador.`,

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