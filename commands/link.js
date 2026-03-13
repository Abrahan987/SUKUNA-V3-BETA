export default {

  command: ['link'],

  category: 'grupo',

  botAdmin: true,

  run: async ({ client, m }) => {

    try {

      const inviteCode = await client.groupInviteCode(m.chat)

      const inviteLink = `https://chat.whatsapp.com/${inviteCode}`

      await client.sendMessage(

        m.chat,

        {

          text:

`🔗 *Enlace de invitación del grupo*

${inviteLink}

✧ Comparte este enlace para que otras personas puedan unirse.`

        },

        { quoted: m }

      )

    } catch (err) {

      console.error(err)

      client.reply(m.chat, msgglobal, m)

    }

  }

}