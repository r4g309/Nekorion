import type { Client } from 'discord.js'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { color, isJsOrTs } from '../functions'
import type { BotEvent } from '../types'

export default async (client: Client): Promise<void> => {
  const eventsDir = join(__dirname, '../events')

  const eventFiles = readdirSync(eventsDir)

  for (const eventFile of eventFiles) {
    if (!isJsOrTs(eventFile)) return
    const event: BotEvent = (await import (`${eventsDir}/${eventFile}`)).default

    if (event.once === true) {
      client.once(event.name, async (...args: unknown[]) => { await event.execute(...args) })
    //   client.once(event.name, event.execute.bind(null, client))
    } else {
      client.on(event.name, async (...args: unknown[]) => { await event.execute(...args) })
    //   client.on(event.name, event.execute.bind(null, client))
    }
    console.log(color('text', `🔥 Successfully loaded event: ${event.name}`))
  }
}
