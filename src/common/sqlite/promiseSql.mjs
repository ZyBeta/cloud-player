import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('.\\db.dat');

export function run(...sql) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      for (const sqlElement of sql) {
        db.run(sqlElement, (err) => {
          if (err) {
            reject(err);
          }
        });
      }
    });
    resolve();
  });
}

export function get(sql) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  });
}
