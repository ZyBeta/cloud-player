import express from 'express';
import bodyParser from 'body-parser';
import {getHeroList} from '../sqlite/heroes.mjs';
import {sendMessageToGroup} from './sender.mjs';
import {getFormatHeroInfo} from '../huiji/hero.mjs';

export default async function init() {
  const app = express();
  app.use(bodyParser.json());

  const cachedHeroes = await getHeroList();

  app.post('/', async (req, res) => {
    const data = req.body;
    if (data['post_type'] === 'message' && data['message_type'] === 'group' && data['sub_type'] !== 'notice') {
      const rawMessage = data['raw_message'];
      const find = cachedHeroes.find(hero => {
        return rawMessage.indexOf(hero['name_zh']) !== -1;
      })
      if (find) {
        const result = await getFormatHeroInfo(find['id']);
        const KUQ = await sendMessageToGroup(result, data['group_id']);
        console.log(KUQ.data)
      }
    }
    res.status(204).json({});
  });

    app.listen(3000, () => {
        console.log('express is listening on port 3000')
    })
}
