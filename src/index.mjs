import consola from 'consola'
import start from './common/express/index.mjs'
import { install } from './common/sqlite/init.mjs'
import crawler from './common/huiji/crawler.mjs'
import { getHeroes, getItems } from './common/steam/init.mjs'

async function init() {
    consola.info('Create db file...')
    await install()
    consola.info('Get heroes info from steam api...')
    await getHeroes()
    consola.success('Get heroes info completed')
    consola.info('Get items info from steam api...')
    await getItems()
    consola.success('Get items info completed')
}

const { argv } = process
if (argv.length < 3) {
    start().then().catch((e) => {
        consola.error(e)
    })
} else if (argv[2] === '-i') {
    init().then(() => {
        consola.success(`Install has completed, you can run 'npm run start' to start.`)
    }).catch((e) => {
        consola.error(e)
    })
} else if (argv[2] === '-c') {
    crawler().then(() => {
        consola.success(`Crawler has completed, you can run 'npm run start' to start.`)
    }).catch((e) => {
        consola.error(e)
    })
}
