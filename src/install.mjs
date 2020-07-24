import consola from 'consola'
import { install } from './common/sqlite/init.mjs'
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

init().then(() => {
    consola.success(`Install has completed, you can run 'npm run start' to start.`)
}).catch((e) => {
    consola.error(e)
})
