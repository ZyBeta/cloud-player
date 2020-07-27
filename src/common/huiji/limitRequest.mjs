import axios from 'axios'
import CONFIG from '../../config.mjs'

const client = axios.create({
    baseURL: 'https://dota.huijiwiki.com/api.php',
    headers: {
        'User-Agent': CONFIG.huiji_user_agent,
        'Accept-Encoding': 'gzip',
        Accept: 'application/json; charset=utf-8;',
    },
    timeout: 30000,
})

function fetch(name) {
    return client.get('', {
        params: {
            action: 'jsondata',
            format: 'json',
            title: `${name}.json`,
        },
    })
}

export default function limitRequest(name) {
    return new Promise((resolve, reject) => {
        const now = Date.now()
        if (!CONFIG.huiji_request_limit || !global.lastFetchTime || now - global.lastFetchTime > CONFIG.huiji_request_limit) {
            fetch(name).then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            }).finally(() => {
                global.lastFetchTime = now
            })
        } else {
            setTimeout(() => {
                fetch(name).then((res) => {
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                }).finally(() => {
                    global.lastFetchTime = now
                })
            }, CONFIG.huiji_request_limit - (now - global.lastFetchTime))
        }
    })
}
