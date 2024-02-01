import { REST, Routes, type SlashCommandBuilder } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { BOT_CLIENT_ID, DISCORD_TOKEN, GUILD_ID, StoreType } from '../constants'
import { color, isJsOrTs } from '../functions'
import BotStore from '../store/app-store'
import { type Command, type SlashCommand } from '../types'

const method = async (): Promise<void> => {
  const slashCommands: SlashCommandBuilder[] = []
  const commands: Command[] = []
  const slashCommandsDir = join(__dirname, '../slashCommands')
  const commandsDir = join(__dirname, '../commands')

  const slashCommandFiles = readdirSync(slashCommandsDir)
  for (const slashCommandFile of slashCommandFiles) {
    if (!isJsOrTs(slashCommandFile)) return
    const command: SlashCommand = (await import (`${slashCommandsDir}/${slashCommandFile}`)).default
    slashCommands.push(command.command)
    BotStore.getStore(StoreType.SlashCommands).set(command.command.name, command)
  }

  const commandFiles = readdirSync(commandsDir)

  for (const commandFile of commandFiles) {
    if (!isJsOrTs(commandFile)) return
    const command: Command = (await import (`${commandsDir}/${commandFile}`)).default
    commands.push(command)
    BotStore.getStore(StoreType.Commands).set(command.name, command)
  }

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)
  // await resetCommands(rest)
  rest.put(
    Routes.applicationCommands(BOT_CLIENT_ID),
    { body: slashCommands.map((command) => command.toJSON()) }
  ).then((data: any) => {
    console.log(color('text', `🔥 Successfully loaded ${color('variable', data.length)} slash command(s)`))
    console.log(color('text', `🔥 Successfully loaded ${color('variable', commands.length)} command(s)`))
  }
  ).catch(
    (error: any) => {
      console.error(error?.rawError?.message ?? 'An error occurred while loading slash commands.')
    }
  )
}

const resetCommands = async (rest: REST): Promise<void> => {
  await rest.put(Routes.applicationGuildCommands(BOT_CLIENT_ID, GUILD_ID), { body: [] })
    .then(() => { console.log(color('error', '❌ Successfully deleted all guild commands.')) })
    .catch(console.error)

  await rest.put(Routes.applicationCommands(BOT_CLIENT_ID), { body: [] })
    .then(() => { console.log(color('error', '❌ Successfully deleted all application commands.')) })
    .catch(console.error)
}

export default method
