import {install} from './common/sqlite/init.mjs';
import {getHeroes, getItems} from './common/steam/init.mjs';
import {getFormatHeroInfo} from './common/huiji/hero';

async function run() {
  try {
    await install();
    await getHeroes();
    await getItems();
    const info = await getFormatHeroInfo(3);
    console.log(info);
  } catch (e) {
    console.log(e);
  }
}

run();
