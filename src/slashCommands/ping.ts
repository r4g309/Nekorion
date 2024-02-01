import { EmbedBuilder, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { getThemeColor } from '../functions'
import type { SlashCommand } from '../types'

export default {
  command: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: 'r4g309' })
          .setDescription(`Pong!\n Ping: ${interaction.client.ws.ping}`)
          .setColor(getThemeColor('text'))
      ]
    })
  },
  cooldown: 10
} satisfies SlashCommand
