import type { Guild } from 'discord.js'
import database from '../store/database'
import type { BotEvent } from '../types'

export default {
  name: 'guildDelete',
  execute: async (guild: Guild) => {
    console.log(`Left a guild: ${guild.name} (id: ${guild.id}).`)
    database.remove.run(guild.id)
  }
} satisfies BotEvent
