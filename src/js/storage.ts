import {defaultOptions, GenerateRandomStringOptions} from "./generatefun";

interface DbOptions extends DbDoc {
    options: GenerateRandomStringOptions
}


/**
 * 获取配置项
 * @param key
 */
function getOptionsValue(key: string = "default"): GenerateRandomStringOptions {
    let localStore: DbOptions = utools.db.get(key);
    if (!localStore) {
        localStore = {
            _id: key,
            options: defaultOptions()
        }
        utools.db.put(localStore)
    }
    debugger
    return localStore.options;
}

/**
 * 恢复初始化设置
 */
function resetOptions(): GenerateRandomStringOptions {
    utools.db.remove("default");
    return getOptionsValue();
}

/**
 * 保存设置
 * @param options
 * @param key
 */
function saveOptions(options: GenerateRandomStringOptions, key: string = "default") {
    const {hasUpperCase, hasLowerCase, hasNumbers, includeChars, excludeChars, length} = options;
    let localStore: DbOptions = {
        _id: key,
        options: {
            hasUpperCase: hasUpperCase,
            hasLowerCase: hasLowerCase,
            hasNumbers: hasNumbers,
            includeChars: includeChars,
            excludeChars: excludeChars,
            length: length
        }
    }
    utools.db.remove(key);
    utools.db.put(localStore);
}

export {getOptionsValue, resetOptions, saveOptions};