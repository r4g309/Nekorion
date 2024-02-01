import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { DISCORD_TOKEN, StoreType } from './constants'
import { isJsOrTs } from './functions'
import appStore from './store/app-store'
import { type Command, type SlashCommand } from './types'

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ]
})

appStore.setNewStore(StoreType.SlashCommands, new Collection<string, SlashCommand>())
appStore.setNewStore(StoreType.Commands, new Collection<string, Command>())
appStore.setNewStore(StoreType.Cooldowns, new Collection<string, number>())

const handlerFiles = readdirSync(join(__dirname, './handlers'))

for (const handlerFile of handlerFiles) {
  if (!isJsOrTs(handlerFile)) continue
  (await import (`./handlers/${handlerFile}`)).default(client)
}

client.login(DISCORD_TOKEN).then(() => { console.log('Bot is online!') }).catch(console.error)
