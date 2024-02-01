export const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? ''
export const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID ?? ''
export const GUILD_ID = process.env.GUILD_ID ?? ''
export const BOT_PREFIX = process.env.PREFIX ?? '/'

export const enum StoreType {
  SlashCommands = 'slashCommands',
  Commands = 'commands',
  Cooldowns = 'cooldowns'
}
