import { type Collection } from 'discord.js'
import { type StoreType } from '../constants'

class BotStore {
  static #instance: BotStore
  store = new Map<string, Collection<string, any>>()
  constructor () {
    if (BotStore.#instance === undefined) {
      return BotStore.#instance
    }
    BotStore.#instance = this
  }

  setNewStore (key: StoreType, value: Collection<string, any>): void {
    this.store.set(key, value)
  }

  getStore (key: StoreType): Collection<string, any> {
    const store = this.store.get(key)
    if (store === undefined) {
      throw new Error('Store not found')
    }
    return store
  }
}

export default new BotStore()
