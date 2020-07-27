import {
    all, get, run, statementRun,
} from './promiseSql.mjs'

const TABLE_NAME = 'items_abilities'

const COLUMNS = [
    // 'item_id',
    'name',
    // 'name_zh',
    'info',
    'extend_info',
    'cold_down',
    'mana',
]

export async function getIAbyItem(itemId) {
    return all(`SELECT * FROM ${TABLE_NAME} WHERE item_id = ${itemId}`)
}

export async function getIA(nameZh) {
    return get(`SELECT * FROM ${TABLE_NAME} WHERE name_zh = '${nameZh}'`)
}

export async function addIA({ itemId, nameZh }) {
    await run(`INSERT INTO ${TABLE_NAME} ( item_id, name_zh) VALUES ( ${itemId}, '${nameZh}')`)
}

export async function deleteIA(nameZh) {
    await run(`DELETE FROM ${TABLE_NAME} WHERE name_zh = '${nameZh}'`)
}

export async function putIA(nameZh, params) {
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
    await statementRun(`UPDATE ${TABLE_NAME} SET ${setStr} WHERE name_zh = '${nameZh}'`, sqlparams)
}
