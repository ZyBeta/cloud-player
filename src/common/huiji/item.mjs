import axios from 'axios'
import { getItem, putItem } from '../sqlite/items.mjs'
import {
    addIA, getIA, getIAbyItem, putIA,
} from '../sqlite/items_abilities.mjs'
import CONFIG from '../../config.mjs'

const client = axios.create({
    baseURL: 'https://dota.huijiwiki.com/api.php',
    headers: {
        'User-Agent': '',
        'Accept-Encoding': 'gzip',
        Accept: 'application/json; charset=utf-8;',
    },
})

function fetchItem(name) {
    return client.get('', {
        params: {
            action: 'jsondata',
            format: 'json',
            title: `${name}.json`,
        },
    })
}

function joinExtend(object) {
    if (!object) return ''
    const keys = Object.keys(object)
    const target = []
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i]
        const comment = object[key]
        target.push(comment['文字'].replace(/<br>/g, '\r\n').replace(/'/g, ''))
    }
    return target.join('\r\n')
}

function findFirst(json) {
    if (json[1]) {
        return findFirst(json[1])
    }
    if (typeof json === 'object') {
        return ''
    }
    return json
}

function parseItem(json, key) {
    const fk = json[key]
    if (fk) {
        return findFirst(fk)
    }
    return ''
}

/* eslint-disable prefer-destructuring,no-await-in-loop */
export async function getCachedItem(id) {
    let item = await getItem(id)
    let ia = await getIAbyItem(id)
    if (item.base_info) {
        // not a good way, for temporary
        return {
            item, ia,
        }
    }
    const res = await fetchItem(item.name_zh)
    const { jsondata } = res.data
    const skills = jsondata['技能']
    if (skills) {
        const keys = Object.keys(skills)
        for (let i = 0; i < keys.length; i += 1) {
            const skill = skills[keys[i]]
            let sqlObject = {
                itemId: id,
                nameZh: skill,
            }
            if (!await getIA(skill)) {
                await addIA(sqlObject)
            }
            const skillRes = await fetchItem(skill)
            const { jsondata: iaJsonData } = skillRes.data
            sqlObject = {}
            sqlObject.name = iaJsonData['代码']
            sqlObject.info = iaJsonData['描述'].replace(/<br>/g, '\r\n')
            sqlObject.extend_info = joinExtend(iaJsonData['注释'])
            sqlObject.mana = parseItem(iaJsonData, '魔法消耗')
            sqlObject.cold_down = parseItem(iaJsonData, '冷却时间')
            await putIA(skill, sqlObject)
        }
    }
    const sqlObject = {}
    sqlObject.info = jsondata['传说'].replace(/<br>/g, '\r\n')
    sqlObject.price = parseItem(jsondata, '价格')
    const comboList = jsondata['组件']
    const combo = []
    if (comboList) {
        Object.keys(comboList).forEach((key) => {
            const comboItemName = comboList[key]['物品名']
            if (comboItemName) {
                combo.push(comboItemName)
            }
        })
        const scroll = parseItem(jsondata, '卷轴价格')
        if (scroll) {
            combo.push(`卷轴(${scroll})`)
        }
    }
    sqlObject.combo = combo.join(' + ')
    sqlObject.attr = parseItem(jsondata, '全属性')
    sqlObject.attr_p = parseItem(jsondata, '主属性百分比')
    sqlObject.s_attr = parseItem(jsondata, '次级属性')
    sqlObject.strength = parseItem(jsondata, '力量')
    sqlObject.agility = parseItem(jsondata, '敏捷')
    sqlObject.intelligence = parseItem(jsondata, '智力')
    sqlObject.health = parseItem(jsondata, '生命值')
    sqlObject.health_regen = parseItem(jsondata, '生命恢复')
    sqlObject.health_regen_p = parseItem(jsondata, '百分比最大生命恢复')
    sqlObject.mana = parseItem(jsondata, '魔法值')
    sqlObject.mana_regen = parseItem(jsondata, '魔法恢复')
    sqlObject.mana_regen_p = parseItem(jsondata, '百分比最大魔法恢复')
    sqlObject.attack = parseItem(jsondata, '攻击力')
    sqlObject.attack_0 = parseItem(jsondata, '近战攻击力')
    sqlObject.attack_1 = parseItem(jsondata, '远程攻击力')
    sqlObject.attack_range = parseItem(jsondata, '攻击距离')
    sqlObject.attack_range_0 = parseItem(jsondata, '近战攻击距离')
    sqlObject.attack_range_1 = parseItem(jsondata, '远程攻击距离')
    sqlObject.attack_regen = parseItem(jsondata, '攻击吸血')
    sqlObject.skill_regen = parseItem(jsondata, '技能吸血')
    sqlObject.armor = parseItem(jsondata, '护甲')
    sqlObject.skill_armor = parseItem(jsondata, '魔法抗性')
    sqlObject.skill_power = parseItem(jsondata, '技能增强')
    sqlObject.evd = parseItem(jsondata, '闪避')
    sqlObject.attack_speed = parseItem(jsondata, '攻击速度')
    sqlObject.speed = parseItem(jsondata, '定值移速')
    sqlObject.speed_p = parseItem(jsondata, '百分比移速')
    sqlObject.skill_mana_down = parseItem(jsondata, '魔法损耗')
    sqlObject.stun_armor = parseItem(jsondata, '状态抗性')
    sqlObject.attack_regen_up = parseItem(jsondata, '吸血增强')
    sqlObject.skill_regen_up = parseItem(jsondata, '技能吸血增强')
    sqlObject.regen_up = parseItem(jsondata, '恢复增强')
    sqlObject.mana_regen_up = parseItem(jsondata, '魔法恢复增强')
    sqlObject.regen_up_2 = parseItem(jsondata, '治疗增强')
    sqlObject.mana_regen_up_2 = parseItem(jsondata, '魔法获取增强')
    sqlObject.skill_range = parseItem(jsondata, '施法距离')
    sqlObject.vision_day = parseItem(jsondata, '白天视野')
    sqlObject.vision_night = parseItem(jsondata, '夜晚视野')
    sqlObject.money = parseItem(jsondata, '金钱')
    sqlObject.turn_rate = parseItem(jsondata, '百分比转身速率')
    sqlObject.projectile_speed_p = parseItem(jsondata, '百分比弹道速度')
    sqlObject.attack_p = parseItem(jsondata, '百分比攻击力')
    sqlObject.stun_armor_down = parseItem(jsondata, '状态抗性降低')
    sqlObject.attack_rate = parseItem(jsondata, '基础攻击间隔')
    sqlObject.armor_down = parseItem(jsondata, '负护甲')
    sqlObject.mana_down = parseItem(jsondata, '负魔法值')
    await putItem(id, sqlObject)
    item = await getItem(id)
    ia = await getIAbyItem(id)
    return {
        item, ia,
    }
}

/* eslint-enable prefer-destructuring,no-await-in-loop */

function formatWord(item, label, key) {
    if (item[key]) {
        return `${label}: ${item[key]}
`
    }
    return ''
}

function formatWordP(item, label, key) {
    if (item[key]) {
        return `${label}: %${item[key]}
`
    }
    return ''
}

function formatWordU(item, label, key) {
    if (item[key]) {
        return `${label}: -${item[key]}
`
    }
    return ''
}

function listab(ab) {
    if (ab.length > 0) {
        const abList = []
        ab.forEach((abs) => {
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
        })
        return abList.join('')
    }
    return ''
}

export async function getFormatItemInfo(id) {
    const { item, ia } = await getCachedItem(id)
    return `${item.name_zh}
${formatWord(item, '价格', 'price')
}${formatWord(item, '配方', 'combo')
}${formatWord(item, '全属性', 'attr')
}${formatWordP(item, '主属性百分比', 'attr_p')
}${formatWord(item, '次级属性', 's_attr')
}${formatWord(item, '力量', 'strength')
}${formatWord(item, '敏捷', 'agility')
}${formatWord(item, '智力', 'intelligence')
}${formatWord(item, '生命值', 'health')
}${formatWord(item, '魔法值', 'mana')
}${formatWord(item, '生命恢复速率', 'health_regen')
}${formatWord(item, '魔法恢复速率', 'mana_regen')
}${formatWordP(item, '最大生命恢复', 'health_regen_p')
}${formatWordP(item, '最大魔法恢复', 'mana_regen_p')
}${formatWord(item, '攻击力', 'attack')
}${formatWord(item, '攻击力(近战)', 'attack_0')
}${formatWord(item, '攻击力(远程)', 'attack_1')
}${formatWord(item, '攻击距离', 'attack_range')
}${formatWord(item, '攻击距离(近战)', 'attack_range_0')
}${formatWord(item, '攻击距离(远程)', 'attack_range_1')
}${formatWordP(item, '攻击吸血', 'attack_regen')
}${formatWordP(item, '技能吸血', 'skill_regen')
}${formatWord(item, '护甲', 'armor')
}${formatWordP(item, '魔法抗性', 'skill_armor')
}${formatWordP(item, '技能增强', 'skill_power')
}${formatWordP(item, '闪避', 'evd')
}${formatWord(item, '攻击速度', 'attack_speed')
}${formatWord(item, '移动速度', 'speed')
}${formatWordP(item, '移动速度', 'speed_p')
}${formatWordP(item, '魔法消耗/损失降低', 'skill_mana_down')
}${formatWordP(item, '状态抗性', 'stun_armor')
}${formatWordP(item, '吸血增强', 'attack_regen_up')
}${formatWordP(item, '技能吸血增强', 'skill_regen_up')
}${formatWordP(item, '恢复增强', 'regen_up')
}${formatWordP(item, '魔法恢复增强', 'mana_regen_up')
}${formatWordP(item, '治疗增强', 'regen_up_2')
}${formatWordP(item, '魔法获取增强', 'mana_regen_up_2')
}${formatWord(item, '施法距离', 'skill_range')
}${formatWord(item, '白天视野', 'vision_day')
}${formatWord(item, '夜晚视野', 'vision_night')
}${formatWord(item, '金钱(每分钟)', 'money')
}${formatWordP(item, '转身速率', 'turn_rate')
}${formatWordP(item, '弹道速度', 'projectile_speed_p')
}${formatWordP(item, '攻击力', 'attack_p')
}${formatWordP(item, '状态抗性降低', 'stun_armor_down')
}${formatWord(item, '基础攻击间隔', 'attack_rate')
}${formatWordU(item, '护甲', 'armor_down')
}${formatWordU(item, '魔法值', 'mana_down')}
物品技能:
${listab(ia)}`
}
