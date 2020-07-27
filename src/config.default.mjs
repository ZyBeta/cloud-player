export default {
    // position of db file (db.dat)
    db_path: '.\\db.dat',
    // a steam api key, can be generated in http://www.steamcommunity.com/dev/apikey
    steam_api_key: 'XXXXX',
    // UA show to huiji wiki, you can put your contact information here
    huiji_user_agent: 'CloudPlayer/1.0 (example.com example@example.com)',
    // request limit to huijiwiki (ms) ( no limit if set with 0)
    huiji_request_limit: 2000,
    // express listening port
    port: 3000,
    // URL of CQ http
    CQ_http_url: 'http://127.0.0.1:5700',
    // if not set, robot will always get info from huiji instead of cache
    game_major_version: '7.27c',
    // show extend info from huiji wiki
    show_extend_info: false,
    // active in private
    private_message: true,
    // active in group
    group_message: true,
    // active in discuss
    discuss_message: true,
    // if is on, robot will try private message
    private_message_in_group: false,
    // rate limit
    rate_limit: false,
    // if is on, robot will only response to command like #!XXX
    only_command: true,
}
