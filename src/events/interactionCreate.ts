import type { AutocompleteInteraction, ChatInputCommandInteraction, Collection, Interaction, ModalSubmitInteraction } from 'discord.js'
import { StoreType } from '../constants'
import BotStore from '../store/app-store'
import type { BotEvent, SlashCommand } from '../types'

const storeCooldowns: Collection<string, number> = BotStore.getStore(StoreType.Cooldowns)
const storeSlashCommands: Collection<string, SlashCommand> = BotStore.getStore(StoreType.SlashCommands)

export default {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      await handleCommandChat(interaction)
    } else if (interaction.isAutocomplete()) {
      await handleAutocomplete(interaction)
    } else if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction)
    }
  }
}satisfies BotEvent

const handleCommandChat = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const command: SlashCommand = BotStore.getStore(StoreType.SlashCommands).get(interaction.commandName)
  if (command === undefined) return
  const validCommand = await handleCooldown(interaction, command)
  if (!validCommand) return
  await command.execute(interaction)
}

const handleCooldown = async (interaction: ChatInputCommandInteraction, command: SlashCommand): Promise<boolean> => {
  const userCooldown = `${interaction.commandName}-${interaction.user.username}-${interaction.user.id}`
  const cooldown = storeCooldowns.get(userCooldown)

  if (command.cooldown !== undefined && cooldown !== undefined) {
    if (Date.now() < cooldown) {
      await interaction.reply({
        content: `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`,
        ephemeral: true
      })
      setTimeout(() => {
        interaction.deleteReply().catch(console.error)
      }, 5000)
      return false
    }
    storeCooldowns.set(userCooldown, Date.now() + command.cooldown * 1000)
    setTimeout(() => {
      storeCooldowns.delete(userCooldown)
    }, command.cooldown * 1000)
  } else if (command.cooldown !== undefined && cooldown === undefined) {
    storeCooldowns.set(userCooldown, Date.now() + command.cooldown * 1000)
  }
  return true
}

const handleAutocomplete = async (interaction: AutocompleteInteraction): Promise<void> => {
  const command = storeSlashCommands.get(interaction.commandName)
  if (command === undefined) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  try {
    if (command.autocomplete === undefined) return
    await command.autocomplete(interaction)
  } catch (error) {
    console.error(error)
  }
}

const handleModalSubmit = async (interaction: ModalSubmitInteraction): Promise<void> => {
  console.log('Modal submit interaction detected')
  const command = storeSlashCommands.get(interaction.customId)
  if (command === undefined) {
    console.error(`No command matching ${interaction.customId} was found.`)
    return
  }
  try {
    if (command.modal === undefined) return
    await command.modal(interaction)
  } catch (error) {
    console.error(error)
  }
}
