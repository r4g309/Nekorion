import { Database } from 'bun:sqlite'

const db = new Database('database.sqlite', {
  create: true
})

db.exec('CREATE TABLE IF NOT EXISTS discord_servers (guild_id INTEGER PRIMARY KEY, prefix CHAR);')

const insert = db.prepare('INSERT INTO discord_servers (guild_id, prefix) VALUES (?, ?);')
const select = db.prepare('SELECT prefix FROM discord_servers WHERE guild_id = ?;')
const update = db.prepare('UPDATE discord_servers SET prefix = ? WHERE guild_id = ?;')
const remove = db.prepare('DELETE FROM discord_servers WHERE guild_id = ?;')

export default {
  db,
  insert,
  select,
  update,
  remove
}
