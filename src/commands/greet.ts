import type { Message } from 'discord.js'
import { type Command } from '../types'

export default {
  name: 'greet',
  execute: async (message: Message, args) => {
    const toGreet = message.mentions.members?.first()
    await message.channel.send(`Hello there ${toGreet !== undefined ? toGreet.user.username : message.member?.user.username}!`)
  },
  permissions: ['Administrator'],
  aliases: ['sayHello', 'sayHi']
} satisfies Command
