import consola from 'consola'
import sll from 'single-line-log2'
import { getCachedHero } from './hero.mjs'
import { getCachedItem } from './item.mjs'
import { getHeroList } from '../sqlite/heroes.mjs'
import { getItemList } from '../sqlite/items.mjs'

const sllout = sll.stdout

function getProcessBar(cur, tot, length, text) {
    const AD = `█`
    const UD = `░`
    const processNum = cur / tot
    const ADNum = (length * processNum).toFixed(0)
    const UNNum = length - ADNum
    const processText = `${(processNum * 100).toFixed(2)}%`
    return `${AD.repeat(ADNum)}${UD.repeat(UNNum)} ${processText} ${text}...`
}

export default async function robot() {
    const list = await getHeroList()
    const num = list.length
    consola.info('Loading hero info...')
    for (let i = 1; i < num; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await getCachedHero(list[i].id)
        sllout(getProcessBar(i + 1, num, 80, list[i].name_zh))
    }
    consola.success('Hero info has loaded')
    consola.info('Loading item info...')
    const list2 = await getItemList()
    const num2 = list2.length
    for (let i = 1; i < num2; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await getCachedItem(list2[i].id)
        sllout(getProcessBar(i + 1, num2, 80, list2[i].name_zh))
    }
    consola.success('Item info has loaded')
}
