import express from 'express'
import bodyParser from 'body-parser'
import { getHeroList } from '../sqlite/heroes.mjs'
import { getItemList } from '../sqlite/items.mjs'
import { sendMessage } from './sender.mjs'
import { getFormatHeroInfo } from '../huiji/hero.mjs'
import { getFormatItemInfo } from '../huiji/item.mjs'
import CONFIG from '../../config.mjs'
import { parseCommand } from './command.mjs'

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
                // TODO
                } else if (!CONFIG.only_command) {
                    let find = cachedHeroes.find((hero) => rawMessage.indexOf(hero.name_zh) !== -1)
                    if (find) {
                        const result = await getFormatHeroInfo(find.id)
                        const KUQ = await sendMessage({
                            ...data,
                            message: result,
                        })
                        console.log(KUQ.data)
                    } else {
                        find = cachedItems.find((item) => rawMessage.indexOf(item.name_zh) !== -1)
                        if (find) {
                            const result = await getFormatItemInfo(find.id)
                            const KUQ = await sendMessage({
                                ...data,
                                message: result,
                            })
                            console.log(KUQ.data)
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
