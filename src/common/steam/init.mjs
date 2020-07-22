import axios from 'axios';
import {addHero} from '../sqlite/heroes.mjs';
import {addItem} from '../sqlite/items.mjs';

const params = {
  key: '1FFFE24DABA34803CE635BDD3BD96E3D',
  language: 'zh-CN',
};

const client = axios.create({
  baseURL: 'http://api.steampowered.com/IEconDOTA2_570/',
});

export async function getHeroes() {
  const res = await client.get('/GetHeroes/v1', {
    params: {...params},
  });
  if (res.data) {
    const heroes = res.data.result.heroes;
    for (let i = 0; i < heroes.length; i++) {
      const hero = heroes[i];
      await addHero({
        id: hero.id,
        name: hero.name,
        nameZh: hero.localized_name,
      });
    }
  }
}

export async function getItems() {
  const res = await client.get('/GetGameItems/v1', {
    params: {...params},
  });
  if (res.data) {
    const items = res.data.result.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await addItem({
        id: item.id,
        name: item.name,
        nameZh: item.localized_name,
      });
    }
  }
}
