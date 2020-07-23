import axios from 'axios'
import { getHero, putHero } from '../sqlite/heroes.mjs'

const client = axios.create({
    baseURL: 'https://dota.huijiwiki.com/api.php',
    headers: {
        'User-Agent': '',
        'Accept-Encoding': 'gzip',
        Accept: 'application/json; charset=utf-8;',
    },
})

function fetchHero(name) {
    return client.get('', {
        params: {
            action: 'jsondata',
            format: 'json',
            title: `${name}.json`,
        },
    })
}

/* eslint-disable prefer-destructuring */
export async function getCachedHero(id) {
    const hero = await getHero(id)
    if (hero.base_info) {
        // not a good way, for temporary
        return hero
    }
    const res = await fetchHero(hero.name_zh)
    const { jsondata } = res.data
    const sqlObject = {}
    sqlObject.alias_en = jsondata['dota英文别名']
    sqlObject.alias_zh = jsondata['dota中文别名']
    sqlObject.base_info = jsondata['简介']
    sqlObject.background_info = jsondata['背景']
    sqlObject.team = jsondata['阵营'][1]
    sqlObject.attribute_primary = jsondata['主属性'][1]
    sqlObject.attack_capabilities = jsondata['近战远程'][1]
    sqlObject.armor = jsondata['护甲'][1]
    sqlObject.attack_max = jsondata['攻击上限'][1]
    sqlObject.attack_min = jsondata['攻击下限'][1]
    sqlObject.attack_point1 = jsondata['攻击前摇'][1]
    sqlObject.attack_point2 = jsondata['攻击后摇']
    sqlObject.attack_speed = jsondata['攻击速度'][1]
    sqlObject.attack_rate = jsondata['攻击间隔'][1]
    sqlObject.attack_range = jsondata['攻击距离'][1]
    sqlObject.projectile_speed = jsondata['弹道速度'][1]
    sqlObject.strength = jsondata['力量'][1]
    sqlObject.strength_gain = jsondata['力量成长'][1]
    sqlObject.agility = jsondata['敏捷'][1]
    sqlObject.agility_gain = jsondata['敏捷成长'][1]
    sqlObject.intelligence = jsondata['智力'][1]
    sqlObject.intelligence_gain = jsondata['智力成长'][1]
    sqlObject.vision_day = jsondata['白天视野'][1]
    sqlObject.vision_night = jsondata['夜晚视野'][1]
    sqlObject.health = jsondata['生命值'][1]
    sqlObject.health_regen = jsondata['生命恢复'][1]
    sqlObject.mana = jsondata['魔法值'][1]
    sqlObject.mana_regen = jsondata['魔法恢复'][1]
    sqlObject.turn_rate = jsondata['转身速率'][1]
    sqlObject.speed = jsondata['移动速度'][1]
    await putHero(id, sqlObject)
    return getHero(id)
}

/* eslint-enable prefer-destructuring */

export async function getFormatHeroInfo(id) {
    const hero = await getCachedHero(id)
    return `${hero.name_zh} ${hero.alias_zh} ${hero.team}${hero.attribute_primary}${hero.attack_capabilities}英雄
攻击: ${hero.attack_min} - ${hero.attack_max} 护甲: ${hero.armor}
攻击速度: ${hero.attack_speed} 攻击间隔: ${hero.attack_rate}
攻击前摇: ${hero.attack_point1} 攻击后摇: ${hero.attack_point2}
攻击范围: ${hero.attack_range} 弹道速度: ${hero.projectile_speed}
力量: ${hero.strength}(+${hero.strength_gain}) 敏捷: ${hero.agility}(+${hero.agility_gain}) 智力: ${hero.intelligence}(+${hero.intelligence_gain})
视野: (${hero.vision_day}/${hero.vision_night})
生命: ${hero.health}(${hero.health_regen}/s) 魔法: ${hero.mana}(${hero.mana_regen}/s)
移动速度: ${hero.speed} 转身速度: ${hero.turn_rate}`
}
