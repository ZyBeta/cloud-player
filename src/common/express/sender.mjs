import axios from 'axios';

const client = axios.create({
    baseURL: 'http://127.0.0.1:5700'
});

export function sendMessageToGroup(message, groupId) {
    return client.post('send_group_msg', {
        group_id: groupId,
        message,
        auto_escape: false
    })
}

export function sendMessageToMe(message) {
    return client.post('send_private_msg', {
        user_id: '295881455',
        message,
        auto_escape: false
    })
}