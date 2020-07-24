import consola from 'consola'
import init from './common/express/index.mjs'

init().then().catch((e) => {
    consola.error(e)
})
