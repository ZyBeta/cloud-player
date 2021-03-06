import {
    all, get, run, statementRun,
} from './promiseSql.mjs'

const TABLE_NAME = 'heroes'

const COLUMNS = [
    // 'id',
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
    'version',
    'not_found',
]

export async function getHeroList() {
    return all(`SELECT id, name_zh FROM ${TABLE_NAME}`)
}

export async function getHeroRandom() {
    return get(`SELECT id, name_zh FROM ${TABLE_NAME} WHERE not_found IS NULL ORDER BY RANDOM()`)
}

export async function getHero(id) {
    return get(`SELECT * FROM ${TABLE_NAME} WHERE id = ${id}`)
}

export async function getHeroByName(name) {
    return get(`SELECT * FROM ${TABLE_NAME} WHERE name_zh LIKE '%${name}%' AND not_found IS NULL`)
}

export async function addHero({ id, name, nameZh }) {
    await run(`INSERT INTO ${TABLE_NAME} ( id, name, name_zh) VALUES ( ${id}, '${name}', '${nameZh}')`)
}

export async function deleteHero(id) {
    await run(`DELETE FROM ${TABLE_NAME} WHERE id = ${id}`)
}

export async function putHero(id, params) {
    const keys = Object.keys(params)
    let setStr = ''
    const sqlparams = []
    for (const key of keys) {
        if ((params[key] === 0 || params[key]) && COLUMNS.indexOf(key) !== -1) {
            setStr += ` ${key} = ?,`
            sqlparams.push(params[key])
        }
    }
    setStr = setStr.substring(0, setStr.length - 1)
    await statementRun(`UPDATE ${TABLE_NAME} SET ${setStr} WHERE id = ${id}`, sqlparams)
}
