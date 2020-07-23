const COMMAND_LIST = {
    // help
    help: ['help', 'h'],
    // query
    query: ['query', 'q'],
    // random
    random: ['random', 'r'],
}

export function parseCommand(string) {
    if (!string.startsWith('!#')) return false
    const command = string.substring(2)
    const keys = Object.keys(COMMAND_LIST)
    let findKey
    let findWord
    for (let i = 0; i < keys; i += 1) {
        const key = keys[i]
        const list = COMMAND_LIST[key]
        for (let j = 0; j < list.length; j += 1) {
            const word = list[j]
            if (command.startsWith(word)) {
                findKey = key
                findWord = word
                break
            }
        }
        if (findKey) break
    }
    const params = {}
    const paramString = command.substring(findWord.length)
    const splitString = paramString.split(' ')
    let nowParam
    for (let i = 0; i < splitString; i += 1) {
        const param = splitString[i].trim()
        if (param) {
            if (param.startsWith('-')) {
                if (nowParam) {
                    params[nowParam.key] = nowParam.list
                }
                nowParam = {}
                nowParam.key = param.substring(1)
                nowParam.list = []
            } else if (nowParam && nowParam.key) {
                if (nowParam.list) {
                    nowParam.list.push(param)
                } else {
                    nowParam.list = [param]
                }
            }
        }
    }
    return {
        key: findKey,
        params,
    }
}
