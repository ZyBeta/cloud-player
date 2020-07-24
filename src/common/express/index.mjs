import express from 'express'
import bodyParser from 'body-parser'
import consola from 'consola'
import { getHeroByName, getHeroList, getHeroRandom } from '../sqlite/heroes.mjs'
import { getItemByName, getItemList, getItemRandom } from '../sqlite/items.mjs'
import { sendMessage } from './sender.mjs'
import { getFormatHeroInfo } from '../huiji/hero.mjs'
import { getFormatItemInfo } from '../huiji/item.mjs'
import CONFIG from '../../config.mjs'
import { COMMAND_TEXT, parseCommand } from './command.mjs'

export default async function init() {
    const app = express()
    app.use(bodyParser.json())

    const cachedHeroes = await getHeroList()
    const cachedItems = await getItemList()

    app.post('/', async (req, res) => {
        const data = req.body
        if (data.post_type === 'message' && data.sub_type !== 'notice') {
            if (data.message_type === 'private' && CONFIG.private_message
                || data.message_type === 'group' && CONFIG.group_message
                || data.message_type === 'discuss' && CONFIG.discuss_message) {
                const rawMessage = data.raw_message
                const parsedCommand = parseCommand(rawMessage)
                if (parsedCommand) {
                    if (parsedCommand.key === 'help') {
                        await sendMessage({
                            ...data,
                            message: COMMAND_TEXT,
                        })
                    }
                    if (parsedCommand.key === 'query') {
                        const target = parsedCommand.params.t
                        const query = parsedCommand.params.q
                        if (target && query) {
                            if (target.indexOf('hero') !== -1) {
                                const hero = await getHeroByName(query[0])
                                if (hero) {
                                    const result = await getFormatHeroInfo(hero.id)
                                    await sendMessage({
                                        ...data,
                                        message: result,
                                    })
                                }
                            }
                            if (target.indexOf('item') !== -1) {
                                const item = await getItemByName(query[0])
                                if (item) {
                                    const result = await getFormatItemInfo(item.id)
                                    await sendMessage({
                                        ...data,
                                        message: result,
                                    })
                                }
                            }
                        } else {
                            await sendMessage({
                                ...data,
                                message: `missing parameter(s)`,
                            })
                        }
                    }
                    if (parsedCommand.key === 'random') {
                        const target = parsedCommand.params.t
                        if (target) {
                            if (target.indexOf('hero') !== -1) {
                                const hero = await getHeroRandom()
                                if (hero) {
                                    const result = await getFormatHeroInfo(hero.id)
                                    await sendMessage({
                                        ...data,
                                        message: result,
                                    })
                                }
                            }
                            if (target.indexOf('item') !== -1) {
                                const item = await getItemRandom()
                                if (item) {
                                    const result = await getFormatItemInfo(item.id)
                                    await sendMessage({
                                        ...data,
                                        message: result,
                                    })
                                }
                            }
                        } else {
                            await sendMessage({
                                ...data,
                                message: `missing parameter(s)`,
                            })
                        }
                    }
                } else if (!CONFIG.only_command) {
                    let find = cachedHeroes.find((hero) => rawMessage.indexOf(hero.name_zh) !== -1)
                    if (find) {
                        const result = await getFormatHeroInfo(find.id)
                        await sendMessage({
                            ...data,
                            message: result,
                        })
                    } else {
                        find = cachedItems.find((item) => rawMessage.indexOf(item.name_zh) !== -1)
                        if (find) {
                            const result = await getFormatItemInfo(find.id)
                            await sendMessage({
                                ...data,
                                message: result,
                            })
                        }
                    }
                }
            }
        }
        await res.status(204).json({})
    })

    app.listen(CONFIG.port || 3000, () => {
        consola.success('Cloud player has already started')
        consola.info(`Cloud player is listening on port ${CONFIG.port}`)
        consola.info(`Make sure the CQ_HTTP_API(${CONFIG.CQ_http_url}) is reachable`)
        consola.info('You can find more info in: https://github.com/ZyBeta/cloud-player')
    })
}
