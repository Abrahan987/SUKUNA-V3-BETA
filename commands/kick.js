 export default {

  command: ['kick'],

  category: 'grupo',

  isAdmin: true,

  botAdmin: true,

  run: async ({ client, m }) => {

    const mention = m.mentionedJid?.[0]

    const quoted = m.quoted?.sender

    const target = mention || quoted

    if (!target) {

      return m.reply('《✧》 Etiqueta o responde al *mensaje* de la *persona* que quieres eliminar')

    }

    const metadata = await client.groupMetadata(m.chat)

    const participants = metadata.participants

    const groupOwner = metadata.owner || `${m.chat.split('-')[0]}@s.whatsapp.net`

    const botOwner = `${global.owner[0][0]}@s.whatsapp.net`

    const botJid = client.decodeJid(client.user.id)

    const exists = participants.some(p =>

      p.id === target ||

      p.jid === target ||

      p.lid === target ||

      p.phoneNumber === target

    )

    if (!exists) {

      return client.reply(

        m.chat,

        `《✧》 *@${target.split('@')[0]}* ya no está en el grupo.`,

        m,

        { mentions: [target] }

      )

    }

    if (target === botJid) {

      return m.reply('《✧》 No puedo eliminar al *bot* del grupo')

    }

    if (target === groupOwner) {

      return m.reply('《✧》 No puedo eliminar al *propietario* del grupo')

    }

    if (target === botOwner) {

      return m.reply('《✧》 No puedo eliminar al *propietario* del bot')

    }

    try {

      await client.groupParticipantsUpdate(m.chat, [target], 'remove')

      await client.reply(

        m.chat,

        `✎ @${target.split('@')[0]} *eliminado* correctamente`,

        m,

        { mentions: [target] }

      )

    } catch {

      m.reply(msgglobal)

    }

  }

}