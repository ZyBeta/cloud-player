# cloud-player

a dota2 cloud player

一个dota2云玩家

基于[酷Q](https://cqp.cc/)和[CQHTTP](https://github.com/richardchien/coolq-http-api)的dota2机器人。
dota2信息来源于[steam官方API](https://wiki.teamfortress.com/wiki/WebAPI)和[dota灰机wiki](https://dota.huijiwiki.com/wiki/%E9%A6%96%E9%A1%B5)。

## 安装

1. 确保你的电脑已经正确安装[nodejs](https://nodejs.org/)和包含[CQHTTP](https://github.com/richardchien/coolq-http-api)插件的[酷Q](https://cqp.cc/)。
2. 将[默认的配置文件](https://github.com/ZyBeta/cloud-player/blob/master/src/config.default.mjs)重命名为`config.mjs`,并修改配置文件。
3. (可选*)将[默认的数据文件](https://github.com/ZyBeta/cloud-player/blob/master/misc/db.dat)复制到配置文件中指定位置下(默认为根目录)。
4. 运行`npm run init`使用配置文件中的`steam_api_key`获取并初始化数据库，如果进行了步骤3，此步骤可以省略。
5. (可选*)如果你想要立即缓存全部信息到数据库，而不是在被需要时再获取，可以运行`npm run crawler`，爬取所有需要的信息。

## 运行

`npm run start`

## 依赖

[package.json](https://github.com/ZyBeta/cloud-player/blob/master/src/package.json)

## License

[MIT](https://github.com/ZyBeta/cloud-player/blob/master/LICENSE)
