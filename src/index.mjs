import { install } from './common/sqlite/init.mjs'
import { getHeroes, getItems } from './common/steam/init.mjs'
import { getFormatHeroInfo } from './common/huiji/hero.mjs'
import Config from './config.mjs'

async function init() {
  try {
    await install()
    await getHeroes()
    await getItems()
  } catch (e) {
    console.log(e)
  }
}

async function run() {
  try {
    const info = await getFormatHeroInfo(3)
    console.log(info)
  } catch (e) {
    console.log(e)
  }
}

console.log(Config.steam_api_key)
