import type { Guild } from 'discord.js'
import { BOT_PREFIX } from '../constants'
import Database from '../store/database'
import type { BotEvent } from '../types'

export default {
  name: 'guildCreate',
  execute: async (guild: Guild) => {
    console.log(`Joined a new guild: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
    Database.insert.run(guild.id, BOT_PREFIX)
    console.log(`Added guild to database: ${guild.name} (id: ${guild.id}).`)
  },
  once: false
} satisfies BotEvent
