import {run} from './promiseSql.mjs';

export function install() {
  run(
      `DROP TABLE IF EXISTS heroes`,
      `CREATE TABLE heroes
             (
                 id                  INTEGER,
                 name                TEXT,
                 name_zh             TEXT,
                 alias_en            TEXT,
                 alias_zh            TEXT,
                 base_info           TEXT,
                 background_info     TEXT,
                 team                TEXT,
                 attribute_primary   TEXT,
                 attack_capabilities TEXT,
                 armor               REAL,
                 attack_max          INTEGER,
                 attack_min          INTEGER,
                 attack_point1       REAL,
                 attack_point2       REAL,
                 attack_speed        INTEGER,
                 attack_rate         REAL,
                 attack_range        INTEGER,
                 projectile_speed    INTEGER,
                 strength            REAL,
                 strength_gain       REAL,
                 agility             REAL,
                 agility_gain        REAL,
                 intelligence        REAL,
                 intelligence_gain   REAL,
                 vision_day          INTEGER,
                 vision_night        INTEGER,
                 health              INTEGER,
                 health_regen        REAL,
                 mana                INTEGER,
                 mana_regen          REAL,
                 turn_rate           REAL,
                 speed               INTEGER
             )`,
      `DROP TABLE IF EXISTS abilities`,
      `CREATE TABLE abilities
             (
                 id      INTEGER,
                 name    TEXT,
                 name_zh TEXT
             )`,
      `DROP TABLE IF EXISTS items`,
      `CREATE TABLE items
             (
                 id      INTEGER,
                 name    TEXT,
                 name_zh TEXT
             )`);
}
