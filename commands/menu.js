import moment from 'moment-timezone'

const menu = {
    command: ['menu', 'help'],
    category: 'main',
    run: async ({ client, m, usedPrefix }) => {
        const videoUrl = 'https://files.catbox.moe/ucanar.mp4'
        const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
        const settings = global.db.data.settings[botId] || {}

        const runtime = (seconds) => {
            seconds = Number(seconds)
            const d = Math.floor(seconds / (3600 * 24))
            const h = Math.floor((seconds % (3600 * 24)) / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = Math.floor(seconds % 60)
            return `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`
        }

        const uptime = runtime(process.uptime())
        const date = moment().tz('America/Bogota').format('DD/MM/YYYY')
        const time = moment().tz('America/Bogota').format('HH:mm:ss')

        let caption = `╭┄┈⟢ *${settings.namebot || 'SUKUNA-MD'}* ⟣┈┄╮\n`
        caption += `┆ ✎ *Usuario:* ${m.pushName || 'Usuario'}\n`
        caption += `┆ ✎ *Fecha:* ${date}\n`
        caption += `┆ ✎ *Hora:* ${time}\n`
        caption += `┆ ✎ *Uptime:* ${uptime}\n`
        caption += `╰┄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯\n\n`

        caption += `┌───⊷ *LISTA DE COMANDOS*\n`

        const categorized = {}

        // Obtenemos los comandos únicos basados en su implementación (pluginName)
        // para evitar duplicados si tienen múltiples triggers
        const seenPlugins = new Set()

        global.comandos.forEach((cmd, trigger) => {
            if (!categorized[cmd.category]) categorized[cmd.category] = []

            // Queremos listar el trigger principal o el comando como tal
            // En este sistema, registramos cada trigger individualmente.
            // Para el menú, podemos agrupar por pluginName y mostrar sus triggers.

            if (!seenPlugins.has(cmd.pluginName)) {
                seenPlugins.add(cmd.pluginName)
                // Buscamos todos los triggers asociados a este plugin
                const triggers = []
                global.comandos.forEach((c, t) => {
                    if (c.pluginName === cmd.pluginName) triggers.push(t)
                })

                categorized[cmd.category].push({
                    name: cmd.pluginName,
                    triggers: triggers
                })
            }
        })

        for (const category in categorized) {
            caption += `│\n`
            caption += `│ ⟣ *${category.toUpperCase()}*\n`
            categorized[category].forEach(cmd => {
                caption += `│ ◍ ${usedPrefix}${cmd.triggers.join(`, ${usedPrefix}`)}\n`
            })
        }

        caption += `└───────────────┈⟢`

        await client.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: caption.trim(),
            gifPlayback: true,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: settings.id || '120363358338732714@newsletter',
                    serverMessageId: '0',
                    newsletterName: settings.nameid || 'SUKUNA CHANNEL'
                },
                externalAdReply: {
                    title: settings.namebot || 'SUKUNA-MD',
                    body: 'Powered by ABRAHAN-M',
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    thumbnailUrl: settings.icon || settings.banner,
                    sourceUrl: settings.link
                }
            }
        }, { quoted: m })
    }
}

export default menu
