
let isNumber = (x) => typeof x === 'number' && !isNaN(x)

function initDB(m, client) {
  const jid = client.user.id.split(':')[0] + '@s.whatsapp.net'

  const settings = global.db.data.settings[jid] ||= {}
  settings.self ??= false
  settings.prefijo ??= ['/', '#', '.']
  settings.id ??= '120363423727229154@newsletter'
  settings.nameid ??= '─𓆩‌۫᷼ ִֶָღܾ݉͢ 𝐒𝐮𝐤꯭፝֟𝐮𝐧𝐚 • 𝐂𝐡𝐚𝐧͠𝐧𝐞𝐥 ִֶ𓆪‌‹࣭݊𓂃ⷪ ִֶָ ᷫ‹ ⷭ.࣭𓆩‌۫᷼Ⴕ۫͜𓆪‌̵̵̲̄͟'
  settings.type ??= 'Sub'
  settings.link ??= 'https://whatsapp.com/channel/0029VaqAtuIK0IBsHYXtvA3e'
  settings.banner ??= 'https://optishield.uk/tmp/5d06b8fb5b76c962101d7ac35.jpg'
  settings.icon ??= 'https://optishield.uk/tmp/6b961f5e5081ab3795b1494fa.jpg'
  settings.currency ??= 'Monedas 🪙'
  settings.namebot ??= 'ৎ୭࠭͢𝑺𝒖𝒌𝒖𝒏𝒂 𝒗3ⷭ𓆪͟͞ '
  settings.namebot2 ??= '⏤͟͞ू⃪ ፝͜⁞𝑺𝒖𝒌𝒖𝒏𝒂✰⃔࿐'
  settings.owner ??= 'ᥫᩣᴀʙʀᴀʜᴀɴ-ᴍ'

  const user = global.db.data.users[m.sender] ||= {}
  user.name ??= ''
  user.exp = isNumber(user.exp) ? user.exp : 0
  user.level = isNumber(user.level) ? user.level : 0
  user.usedcommands = isNumber(user.usedcommands) ? user.usedcommands : 0
  user.pasatiempo ??= ''
  user.description ??= ''
  user.marry ??= ''
  user.genre ??= ''
  user.birth ??= ''
  user.metadatos ??= null
  user.metadatos2 ??= null

  const chat = global.db.data.chats[m.chat] ||= {}
  chat.users ||= {}
  chat.bannedGrupo ??= false
  chat.welcome ??= true
  chat.nsfw ??= false
  chat.alerts ??= true
  chat.gacha ??= true
  chat.rpg ??= true
  chat.adminonly ??= false
  chat.primaryBot ??= null
  chat.antilinks ??= true
  chat.personajesReservados ||= []

  chat.users[m.sender] ||= {}
  chat.users[m.sender].coins = isNumber(chat.users[m.sender].coins) ? chat.users[m.sender].coins : 0
  chat.users[m.sender].bank = isNumber(chat.users[m.sender].bank) ? chat.users[m.sender].bank : 0
  chat.users[m.sender].characters = Array.isArray(chat.users[m.sender].characters) ? chat.users[m.sender].characters : []
}

export default initDB;
