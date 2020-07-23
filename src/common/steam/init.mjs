import axios from 'axios'
import { addHero } from '../sqlite/heroes.mjs'
import { addItem } from '../sqlite/items.mjs'
import CONFIG from '../../config.mjs'

const params = {
    key: CONFIG.steam_api_key,
    language: 'zh-CN',
}

const client = axios.create({
    baseURL: 'http://api.steampowered.com/IEconDOTA2_570/',
})

export async function getHeroes() {
    const res = await client.get('/GetHeroes/v1', {
        params: { ...params },
    })
    if (res.data) {
        const { heroes } = res.data.result
        const tasks = []
        heroes.forEach((hero) => {
            tasks.push(addHero({
                id: hero.id,
                name: hero.name,
                nameZh: hero.localized_name,
            }))
        })
        await Promise.all(tasks)
    }
}

export async function getItems() {
    const res = await client.get('/GetGameItems/v1', {
        params: { ...params },
    })
    if (res.data) {
        const { items } = res.data.result
        const tasks = []
        items.forEach((item) => {
            tasks.push(addItem({
                id: item.id,
                name: item.name,
                nameZh: item.localized_name,
            }))
        })
        await Promise.all(tasks)
    }
}
