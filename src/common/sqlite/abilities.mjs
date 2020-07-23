import { all, get, run } from './promiseSql.mjs'

const TABLE_NAME = 'abilities'

const COLUMNS = [
    // 'hero_id',
    'name',
    // 'name_zh',
    'type',
    'info',
    'extend_info',
    'cold_down',
    'mana',
]

export async function getABbyHero(heroId) {
    return all(`SELECT * FROM ${TABLE_NAME} WHERE hero_id = ${heroId}`)
}

export async function getAB(nameZh) {
    return get(`SELECT * FROM ${TABLE_NAME} WHERE name_zh = '${nameZh}'`)
}

export async function addAB({ heroId, nameZh }) {
    await run(`INSERT INTO ${TABLE_NAME} ( hero_id, name_zh) VALUES ( ${heroId}, '${nameZh}')`)
}

export async function deleteAB(nameZh) {
    await run(`DELETE FROM ${TABLE_NAME} WHERE name_zh = '${nameZh}'`)
}

export async function putAB(nameZh, params) {
    const keys = Object.keys(params)
    let setStr = ''
    for (const key of keys) {
        if (params[key] && COLUMNS.indexOf(key) !== -1) {
            setStr += ` ${key} = '${params[key]}',`
        }
    }
    setStr = setStr.substring(0, setStr.length - 1)
    await run(`UPDATE ${TABLE_NAME} SET ${setStr} WHERE name_zh = '${nameZh}'`)
}
