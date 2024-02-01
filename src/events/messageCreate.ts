import { ChannelType, type Message } from 'discord.js'
import { BOT_PREFIX, StoreType } from '../constants'
import { checkPermissions, sendTimedMessage } from '../functions'
import BotStore from '../store/app-store'
import Database from '../store/database'
import type { BotEvent, Command } from '../types'

export default {
  name: 'messageCreate',
  execute: async (message: Message) => {
    if (message.author.bot || (message.member == null) || (message.guild == null)) return
    const guildId = message.guild.id
    let prefix = BOT_PREFIX
    const data: any = Database.select.get(guildId)
    if (data !== null) {
      prefix = data.prefix
    }
    const { content } = message
    if (!content.startsWith(prefix) || message.channel.type !== ChannelType.GuildText) return
    const args = content.substring(prefix.length).split(/ +/)
    const commandStore = BotStore.getStore(StoreType.Commands)
    let command: Command = commandStore.get(args[0])

    if (command === undefined) {
      const commandFromAlias = commandStore.find((cmd) => cmd.aliases?.includes(args[0]))
      if (commandFromAlias !== undefined) {
        command = commandFromAlias
      } else {
        return
      }
    }

    const userCooldown = `${command.name}-${message.member.user.username}-${message.member.user.id}`
    const cooldownStore = BotStore.getStore(StoreType.Cooldowns)

    const cooldown = cooldownStore.get(userCooldown)
    const neededPermissions = checkPermissions(message.member, command.permissions)
    if (neededPermissions !== null) {
      await sendTimedMessage(
        `You don't have enough permissions to use this command.\n
        Needed permissions: ${neededPermissions.join(', ')} `,
        message.channel,
        5000)
      return
    }
    if ((command.cooldown !== undefined) && cooldown !== undefined) {
      if (Date.now() < cooldown) {
        await sendTimedMessage(
                    `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`,
                    message.channel,
                    5000
        )
        return
      }
      cooldownStore.set(userCooldown, Date.now() + command.cooldown * 1000)
      setTimeout(() => {
        cooldownStore.delete(`${command?.name}-${message.member?.user.username}`)
      }, command.cooldown * 1000)
    } else if ((command.cooldown !== undefined) && cooldown === undefined) {
      cooldownStore.set(userCooldown, Date.now() + command.cooldown * 1000)
    }

    await command.execute(message, args)
  }
} satisfies BotEvent
