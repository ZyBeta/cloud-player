import { getFormatHeroInfo } from './common/huiji/hero.mjs'
import { getHeroRandom } from './common/sqlite/heroes.mjs'
import { getFormatItemInfo } from './common/huiji/item.mjs'
import { getItemRandom } from './common/sqlite/items.mjs'

async function test() {
    const hero = await getHeroRandom()
    const result1 = await getFormatHeroInfo(hero.id)
    console.log(result1)
    const item = await getItemRandom()
    const result2 = await getFormatItemInfo(item.id)
    console.log(result2)
}

test().then()
