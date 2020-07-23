import { run } from './promiseSql.mjs'

export async function install() {
    await run(
        `DROP TABLE IF EXISTS heroes`,
        `CREATE TABLE heroes
             (
                 id                  INTEGER PRIMARY KEY NOT NULL,
                 name                TEXT,
                 name_zh             TEXT,
                 alias_en            TEXT,
                 alias_zh            TEXT,
                 base_info           TEXT,
                 background_info     TEXT,
                 team                TEXT,
                 attribute_primary   TEXT,
                 attack_capabilities TEXT,
                 armor               TEXT,
                 attack_max          TEXT,
                 attack_min          TEXT,
                 attack_point1       TEXT,
                 attack_point2       TEXT,
                 attack_speed        TEXT,
                 attack_rate         TEXT,
                 attack_range        TEXT,
                 projectile_speed    TEXT,
                 strength            TEXT,
                 strength_gain       TEXT,
                 agility             TEXT,
                 agility_gain        TEXT,
                 intelligence        TEXT,
                 intelligence_gain   TEXT,
                 vision_day          TEXT,
                 vision_night        TEXT,
                 health              TEXT,
                 health_regen        TEXT,
                 mana                TEXT,
                 mana_regen          TEXT,
                 turn_rate           TEXT,
                 speed               TEXT
             )`,
        `DROP TABLE IF EXISTS abilities`,
        `CREATE TABLE abilities
             (
                 hero_id      INTEGER,
                 name    TEXT,
                 name_zh TEXT PRIMARY KEY NOT NULL,
                 type        TEXT,
                 info        TEXT,
                 extend_info TEXT,
                 cold_down   TEXT,
                 mana        TEXT
             )`,
        `DROP TABLE IF EXISTS items`,
        `CREATE TABLE items
             (
                 id                 INTEGER PRIMARY KEY NOT NULL,
                 name               TEXT,
                 name_zh            TEXT,
                 info               TEXT,
                 price              TEXT,
                 combo              TEXT,
                 attr               TEXT,
                 attr_p             TEXT,
                 s_attr             TEXT,
                 strength           TEXT,
                 agility            TEXT,
                 intelligence       TEXT,
                 health             TEXT,
                 health_regen       TEXT,
                 health_regen_p     TEXT,
                 mana               TEXT,
                 mana_regen         TEXT,
                 mana_regen_p       TEXT,
                 attack             TEXT,
                 attack_0           TEXT,
                 attack_1           TEXT,
                 attack_range       TEXT,
                 attack_range_0     TEXT,
                 attack_range_1     TEXT,
                 attack_regen       TEXT,
                 skill_regen        TEXT,
                 armor              TEXT,
                 skill_armor        TEXT,
                 skill_power        TEXT,
                 evd                TEXT,
                 attack_speed       TEXT,
                 speed              TEXT,
                 speed_p            TEXT,
                 skill_mana_down    TEXT,
                 stun_armor         TEXT,
                 attack_regen_up    TEXT,
                 skill_regen_up     TEXT,
                 regen_up           TEXT,
                 mana_regen_up      TEXT,
                 regen_up_2         TEXT,
                 mana_regen_up_2    TEXT,
                 skill_range        TEXT,
                 vision_day         TEXT,
                 vision_night       TEXT,
                 money              TEXT,
                 turn_rate          TEXT,
                 projectile_speed_p TEXT,
                 attack_p           TEXT,
                 stun_armor_down    TEXT,
                 attack_rate        TEXT,
                 armor_down         TEXT,
                 mana_down          TEXT
             )`,
        `DROP TABLE IF EXISTS items_abilities`,
        `CREATE TABLE items_abilities
             (
                 item_id     INTEGER,
                 name        TEXT,
                 name_zh     TEXT PRIMARY KEY NOT NULL,
                 info        TEXT,
                 extend_info TEXT,
                 cold_down   TEXT,
                 mana        TEXT
             )`,
    )
}
