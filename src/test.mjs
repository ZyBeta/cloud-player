import consola from 'consola'
import { getFormatHeroInfo } from './common/huiji/hero.mjs'
import { getHeroRandom } from './common/sqlite/heroes.mjs'
import { getFormatItemInfo } from './common/huiji/item.mjs'
import { getItemRandom } from './common/sqlite/items.mjs'

async function test() {
    const hero = await getHeroRandom()
    const result1 = await getFormatHeroInfo(hero.id)
    consola.info(result1)
    const item = await getItemRandom()
    const result2 = await getFormatItemInfo(item.id)
    consola.info(result2)
}

test().then().catch((e) => {
    consola.error(e)
})
