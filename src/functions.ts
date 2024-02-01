import chalk from 'chalk'
import { PermissionFlagsBits, type GuildMember, type PermissionResolvable, type TextChannel } from 'discord.js'
import { setTimeout as sleep } from 'node:timers/promises'
import { extname } from 'path'

type ColorType = 'text' | 'variable' | 'error'

const themeColors = {
  text: '#ff8e4d',
  variable: '#ff624d',
  error: '#f5426c'
}

export const color = (color: ColorType, message: any): string => chalk.hex(themeColors[color])(message)

export const isJsOrTs = (fileName: string): boolean => ['.ts', '.js'].includes(extname(fileName))

export const getThemeColor = (color: ColorType): number => Number(`0x${themeColors[color].substring(1)}`)

export const checkPermissions = (member: GuildMember, permissions: PermissionResolvable[]):(Array<string | undefined> | null) => {
  const neededPermissions: PermissionResolvable[] = []
  for (const permission of permissions) {
    if (!member.permissions.has(permission)) {
      neededPermissions.push(permission)
    }
  }
  if (neededPermissions.length === 0) { return null }

  return neededPermissions.map((permissions: PermissionResolvable) => {
    if (typeof permissions === 'string') {
      return permissions.split(/(?=[A-Z])/).join(' ')
    } else {
      return Object.keys(permissions).find((key) => Object(PermissionFlagsBits)[key] === permissions)
    }
  })
}

export const sendTimedMessage = async (message: string, channel: TextChannel, duration: number): Promise<void> => {
  channel.send(message)
    .then(async m => {
      await sleep(duration)
      await (await channel.messages.fetch(m)).delete()
    })
    .catch(console.error)
}
