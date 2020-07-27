import consola from 'consola'
import sll from 'single-line-log2'
import { getCachedHero } from './hero.mjs'
import { getCachedItem } from './item.mjs'
import { getHeroList } from '../sqlite/heroes.mjs'
import { getItemList } from '../sqlite/items.mjs'

const sllout = sll.stdout

const getProcessBar = function (cur, tot, length, text) {
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
    consola.info('正在获取英雄信息...')
    for (let i = 1; i < num; i += 1) {
        await getCachedHero(list[i].id)
        sllout(getProcessBar(i + 1, num, 80, list[i].name_zh))
    }
    consola.success('英雄信息获取完成')
    consola.error('正在获取物品信息...')
    const list2 = await getItemList()
    const num2 = list2.length
    for (let i = 1; i < num2; i += 1) {
        await getCachedItem(list[i].id)
        sllout(getProcessBar(i + 1, num, 80, list[i].name_zh))
    }
    consola.success('物品信息获取完成')
}
