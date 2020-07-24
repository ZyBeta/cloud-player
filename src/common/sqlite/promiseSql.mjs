import sqlite3 from 'sqlite3'
import CONFIG from '../../config.mjs'

sqlite3.verbose()

const db = new sqlite3.Database(CONFIG.db_path)

export function run(...sqls) {
    const tasks = []
    sqls.forEach((sql) => {
        tasks.push(new Promise((resolve, reject) => {
            db.run(sql, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        }))
    })
    return Promise.all(tasks)
}

export function get(sql) {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

export function all(sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}
