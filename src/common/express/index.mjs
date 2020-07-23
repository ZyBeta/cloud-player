import express from 'express'
import bodyParser from 'body-parser'
import { getHeroList, getHeroByName } from '../sqlite/heroes.mjs'
import { getItemList, getItemByName } from '../sqlite/items.mjs'
import { sendMessage } from './sender.mjs'
import { getFormatHeroInfo } from '../huiji/hero.mjs'
import { getFormatItemInfo } from '../huiji/item.mjs'
import CONFIG from '../../config.mjs'
import { parseCommand, COMMAND_TEXT } from './command.mjs'

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
                    console.log(parsedCommand)
                    if (parsedCommand.key === 'help') {
                        await sendMessage({
                            ...data,
                            message: COMMAND_TEXT,
                        })
                    }
                    if (parsedCommand.key === 'query') {
                        const target = parsedCommand.params.t
                        const query = parsedCommand.params.q
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
        res.status(204).json({})
    })

    app.listen(3000, () => {
        console.log('express is listening on port 3000')
    })
}
