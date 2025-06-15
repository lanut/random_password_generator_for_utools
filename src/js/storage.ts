import {defaultOptions, GenerateRandomStringOptions} from "./generatefun";

/**
 * 获取配置项
 * @param key
 */
function getOptionsValue(key: string = "default"): GenerateRandomStringOptions {
    let localOptions: GenerateRandomStringOptions = utools.dbStorage.getItem(key);
    if (!localOptions) {
        localOptions = defaultOptions();
        saveOptions(localOptions, key);
    }
    debugger
    return localOptions;
}

/**
 * 恢复初始化设置
 */
function resetOptions(): GenerateRandomStringOptions {
    utools.dbStorage.removeItem("default");
    return getOptionsValue();
}

/**
 * 保存设置
 * @param options
 * @param key
 */
function saveOptions(options: GenerateRandomStringOptions, key: string = "default") {
    utools.dbStorage.setItem(key, options)
}

export {getOptionsValue, resetOptions, saveOptions};