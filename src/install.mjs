import { install } from './common/sqlite/init.mjs'
import { getHeroes, getItems } from './common/steam/init.mjs'

async function init() {
    try {
        await install()
        await getHeroes()
        await getItems()
    } catch (e) {
        console.log(e)
    }
}

init().then()
