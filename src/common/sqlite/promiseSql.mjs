import sqlite3 from 'sqlite3'
import CONFIG from '../../config.mjs'

sqlite3.verbose()

const db = new sqlite3.Database(CONFIG.db_path)

export function run(...sql) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      for (const sqlElement of sql) {
        db.run(sqlElement, (err) => {
          if (err) {
            reject(err)
          }
        })
      }
    })
    resolve()
  })
}

export function get(sql) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(sql, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  })
}

export function all(sql) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sql, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  })
}

export function all(sql) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  });
}
