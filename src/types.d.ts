import { type ModalSubmitInteraction, type AutocompleteInteraction, type CacheType, type ChatInputCommandInteraction, type ClientEvents, type Message, type PermissionResolvable, type SlashCommandBuilder } from 'discord.js'

export interface SlashCommand {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
  cooldown?: number
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
  modal?: (interaction: ModalSubmitInteraction<CacheType>) => Promise<void>
}

export interface Command {
  name: string
  execute: (message: Message, args: string[]) => Promise<void>
  permissions: PermissionResolvable[]
  aliases: string[]
  cooldown?: number
}

export interface BotEvent {
  name: keyof ClientEvents
  once?: boolean
  execute: (...args?) => Promise<void>
}
