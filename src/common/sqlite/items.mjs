import { get, run } from './promiseSql.mjs'

const TABLE_NAME = 'items'

const COLUMNS = [
    // 'id',
    'name',
    'name_zh',
    'info',
    'price',
    'combo',
    'attr',
    'attr_p',
    's_attr',
    'strength',
    'agility',
    'intelligence',
    'health',
    'health_regen',
    'health_regen_p',
    'mana',
    'mana_regen',
    'mana_regen_p',
    'attack',
    'attack_0',
    'attack_1',
    'attack_range',
    'attack_range_0',
    'attack_range_1',
    'attack_regen',
    'skill_regen',
    'armor',
    'skill_armor',
    'skill_power',
    'evd',
    'attack_speed',
    'speed',
    'speed_p',
    'skill_mana_down',
    'stun_armor',
    'attack_regen_up',
    'skill_regen_up',
    'regen_up',
    'mana_regen_up',
    'regen_up_2',
    'mana_regen_up_2',
    'skill_range',
    'mana_regen_up_2',
    'vision_day',
    'vision_night',
    'money',
    'turn_rate',
    'projectile_speed_p',
    'attack_p',
    'stun_armor_down',
    'attack_rate',
    'armor_down',
    'mana_down',
]

export async function getItemList() {
    return get(`SELECT ( id, name_zh) FROM ${TABLE_NAME}`)
}

export async function getItem(id) {
    return get(`SELECT * FROM ${TABLE_NAME} WHERE id = ${id}`)
}

export async function addItem({ id, name, nameZh }) {
    await run(`INSERT INTO ${TABLE_NAME} ( id, name, name_zh) VALUES ( ${id}, '${name}', '${nameZh}')`)
}

export async function deleteItem(id) {
    await run(`DELETE FROM ${TABLE_NAME} WHERE id = ${id}`)
}

export async function putItem(id, params) {
    const keys = Object.keys(params)
    let setStr = ''
    for (const key of keys) {
        if (params[key] && COLUMNS.indexOf(key) !== -1) {
            setStr += ` ${key} = '${params[key]}',`
        }
    }
    setStr = setStr.substring(0, setStr.length - 1)
    await run(`UPDATE ${TABLE_NAME} SET ${setStr} WHERE id = ${id}`)
}
