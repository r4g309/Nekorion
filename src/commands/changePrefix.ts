import type { Message } from 'discord.js'
import database from '../store/database'
import { type Command } from '../types'

export default {
  name: 'changePrefix',
  execute: async (message: Message, args) => {
    const [, newPrefix] = args
    if (newPrefix === undefined) {
      await message.channel.send('You need to provide a new prefix')
      return
    }
    if (message.guild === null) { return }
    database.update.run(newPrefix, message.guild.id)
    await message.channel.send(`The prefix has been updated to ${newPrefix}!`)
  },
  permissions: ['Administrator'],
  aliases: []
} satisfies Command
