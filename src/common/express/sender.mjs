import axios from 'axios'
import CONFIG from '../../config.mjs'

const client = axios.create({
    baseURL: CONFIG.CQ_http_url,
})

/* eslint-disable camelcase */
export async function sendMessage({
    message,
    user_id,
    group_id,
    discuss_id,
    message_type,
}) {
    let url
    if (message_type === 'private') url = 'send_private_msg'
    if (message_type === 'group') url = 'send_group_msg'
    if (message_type === 'discuss') url = 'send_discuss_msg'
    if (CONFIG.rate_limit) url += '_rate_limited'
    await client.post(url, {
        user_id,
        group_id,
        discuss_id,
        message,
        auto_escape: false,
    })
    if (CONFIG.private_message_in_group && message_type !== 'private') {
        url = 'send_private_msg'
        if (CONFIG.rate_limit) url += '_rate_limited'
        await client.post(url, {
            user_id,
            group_id,
            discuss_id,
            message,
            auto_escape: false,
        })
    }
}
