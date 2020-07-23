import { get, run } from './promiseSql.mjs'

const TABLE_NAME = 'heroes'

const COLUMNS = [
    'id',
    'name',
    'name_zh',
    'alias_en',
    'alias_zh',
    'base_info',
    'background_info',
    'team',
    'attribute_primary',
    'attack_capabilities',
    'armor',
    'attack_max',
    'attack_min',
    'attack_point1',
    'attack_point2',
    'attack_speed',
    'attack_rate',
    'attack_range',
    'projectile_speed',
    'strength',
    'strength_gain',
    'agility',
    'agility_gain',
    'intelligence',
    'intelligence_gain',
    'vision_day',
    'vision_night',
    'health',
    'health_regen',
    'mana',
    'mana_regen',
    'turn_rate',
    'speed',
]

export async function getHero(id) {
    return get(`SELECT * FROM ${TABLE_NAME} WHERE id = ${id}`)
}

export function addHero({ id, name, nameZh }) {
    run(`INSERT INTO ${TABLE_NAME} ( id, name, name_zh) VALUES ( ${id}, '${name}', '${nameZh}')`)
}

export function deleteHero(id) {
    run(`DELETE FROM ${TABLE_NAME} WHERE id = ${id}`)
}

export function putHero(id, params) {
    const keys = Object.keys(params)
    let setStr = ''
    for (const key of keys) {
        if (COLUMNS.indexOf(key) !== -1) {
            setStr += ` ${key} = '${params[key]}',`
        }
    }
    setStr = setStr.substring(0, setStr.length - 1)

    run(`UPDATE ${TABLE_NAME} SET ${setStr} WHERE id = ${id}`)
}
