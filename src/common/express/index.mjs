import express from 'express'
import bodyParser from 'body-parser'

export default function init() {
    const app = express()
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        console.log(req.body)
        const data = req.body
        if (data.post_type === 'message' && data.message_type === 'group' && data.sub_type !== 'notice') {
            const rawMessage = data.raw_message
            console.log(rawMessage)
        }
        res.status(204).json({})
    })

    app.listen(3000, () => {
        console.log('express is listening on port 3000')
    })
}
