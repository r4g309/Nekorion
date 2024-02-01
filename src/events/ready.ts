import type { Client } from 'discord.js'
import type { BotEvent } from '../types'

export default {
  name: 'ready',
  execute: async (client: Client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`)
  }
} satisfies BotEvent
