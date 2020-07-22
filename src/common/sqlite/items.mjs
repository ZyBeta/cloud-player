import {get, run} from './promiseSql.mjs';

const TABLE_NAME = 'items';

export async function getItem(id) {
  return await get(`SELECT * FROM ${TABLE_NAME} WHERE id = ${id}`);
}

export function addItem({id, name, nameZh}) {
  run(`INSERT INTO ${TABLE_NAME} ( id, name, name_zh) VALUES ( ${id}, '${name}', '${nameZh}')`);
}

export function deleteItem(id) {
  run(`DELETE FROM ${TABLE_NAME} WHERE id = ${id}`);
}

export function putItem({id, name}) {
  run(`UPDATE ${TABLE_NAME} SET name = '${name}' WHERE id = ${id}`);
}
