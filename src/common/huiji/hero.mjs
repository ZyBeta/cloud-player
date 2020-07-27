import { getHero, putHero } from '../sqlite/heroes.mjs'
import limitRequest from './limitRequest.mjs'
import {
    addAB, getAB, getABbyHero, putAB,
} from '../sqlite/abilities.mjs'
import CONFIG from '../../config.mjs'

function formatWikiText(wikiText) {
    return wikiText.replace(/\[\[.*?link.*?]]/g, ' ')
        .replace(/\[\[file.*?]]/g, ' ')
        .replace(/'/g, '')
        .replace(/<br>/g, '\r\n')
}

function joinExtend(object) {
    if (!object) return ''
    const keys = Object.keys(object)
    const target = []
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i]
        const comment = object[key]
        target.push(formatWikiText(comment['文字']))
    }
    return target.join('\r\n')
}

function parseMana(json) {
    const fk = json['魔法消耗']
    if (fk[1] && fk[1][1] && fk[1][1][1]) {
        const mana = []
        const listO = fk[1][1][1]
        Object.keys(listO).forEach((key) => {
            if (typeof listO[key] === 'number') {
                mana.push(listO[key])
            }
        })
        return mana.join('/')
    }
    return ''
}

function parseCD(json) {
    const fk = json['冷却时间']
    if (fk[1] && fk[1][1]) {
        const cd = []
        const listO = fk[1][1]
        Object.keys(listO).forEach((key) => {
            if (typeof listO[key] === 'number') {
                cd.push(listO[key])
            }
        })
        return cd.join('/')
    }
    return ''
}

/* eslint-disable prefer-destructuring,no-await-in-loop */
export async function getCachedHero(id) {
    let hero = await getHero(id)
    let ab = await getABbyHero(id)
    if (hero && hero.version && hero.version === CONFIG.game_major_version) {
        return {
            hero, ab,
        }
    }
    const res = await limitRequest(hero.name_zh)
    const { jsondata } = res.data
    if (!jsondata) {
        await putHero(id, { not_found: '1' })
        return {
            hero, ab,
        }
    }
    const skills = jsondata['技能']
    if (skills) {
        const keys = Object.keys(skills)
        for (let i = 0; i < keys.length; i += 1) {
            const skill = skills[keys[i]]
            let sqlObject = {
                heroId: id,
                nameZh: skill,
            }
            if (!await getAB(skill)) {
                await addAB(sqlObject)
            }
            const skillRes = await limitRequest(skill)
            const { jsondata: abJsonData } = skillRes.data
            sqlObject = {}
            sqlObject.name = abJsonData['代码']
            if (abJsonData['次级分类'] && abJsonData['次级分类'] === '英雄技能') {
                sqlObject.type = 1
            }
            if (abJsonData['次级分类'] && abJsonData['次级分类'] === '天赋技能') {
                sqlObject.type = 2
            }
            if (abJsonData['描述']) {
                sqlObject.info = abJsonData['描述'].replace(/<br>/g, '\r\n')
            } else {
                sqlObject.info = formatWikiText(abJsonData['中文名'])
            }
            sqlObject.extend_info = joinExtend(abJsonData['注释'])
            sqlObject.mana = parseMana(abJsonData)
            sqlObject.cold_down = parseCD(abJsonData)
            await putAB(skill, sqlObject)
        }
    }
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
    sqlObject.version = jsondata['版本']
    await putHero(id, sqlObject)
    hero = await getHero(id)
    ab = await getABbyHero(id)
    return {
        hero,
        ab,
    }
}

function listab(ab, key) {
    if (ab.length > 0) {
        const abList = []
        ab.forEach((abs) => {
            if (abs.type && abs.type === key) {
                let string = ''
                string += (`${abs.name_zh} :\r\n`)
                if (abs.info) {
                    string += (`${abs.info}\r\n`)
                }
                if (abs.mana) {
                    string += (`魔法消耗: ${abs.mana}\r\n`)
                }
                if (abs.cold_down) {
                    string += (`冷却时间: ${abs.cold_down}\r\n`)
                }
                if (CONFIG.show_extend_info) {
                    if (abs.extend_info) {
                        string += (`${abs.extend_info}\r\n`)
                    }
                }
                abList.push(string)
            }
        })
        return abList.join('')
    }
    return ''
}

/* eslint-enable prefer-destructuring,no-await-in-loop */

export async function getFormatHeroInfo(id) {
    const { hero, ab } = await getCachedHero(id)
    return `${hero.name_zh} ${hero.alias_zh || ''} ${hero.team}${hero.attribute_primary}${hero.attack_capabilities}英雄
攻击: ${hero.attack_min} - ${hero.attack_max} 护甲: ${hero.armor}
攻击速度: ${hero.attack_speed} 攻击间隔: ${hero.attack_rate}
攻击前摇: ${hero.attack_point1} 攻击后摇: ${hero.attack_point2}
攻击范围: ${hero.attack_range} 弹道速度: ${hero.projectile_speed}
力量: ${hero.strength}(+${hero.strength_gain}) 敏捷: ${hero.agility}(+${hero.agility_gain}) 智力: ${hero.intelligence}(+${hero.intelligence_gain})
视野: (${hero.vision_day}/${hero.vision_night})
生命: ${hero.health}(${hero.health_regen}/s) 魔法: ${hero.mana}(${hero.mana_regen}/s)
移动速度: ${hero.speed} 转身速度: ${hero.turn_rate}

技能:
${listab(ab, '1')}
天赋:
${listab(ab, '2')}`
}
