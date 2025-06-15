// noinspection SpellCheckingInspection

/**
 * 定义生成随机字符串的选项接口
 */
interface GenerateRandomStringOptions {
    /**
     * 是否包含大写字母
     */
    hasUpperCase: boolean;
    /**
     * 是否包含小写字母
     */
    hasLowerCase: boolean;
    /**
     * 是否包含数字
     */
    hasNumbers: boolean;
    /**
     * 包含的特殊字符
     */
    includeChars?: string;
    /**
     * 排除的特殊字符
     */
    excludeChars?: string;
    /**
     * 生成字符串的长度
     */
    length: number;
}

/**
 * 根据选项获取排除字符后的可用字符集
 * @param options 生成随机字符串的选项
 * @returns 可用的字符集
 */
function getExcludeChars(options: GenerateRandomStringOptions) {
    let {hasUpperCase, hasLowerCase, hasNumbers, includeChars, excludeChars} = options;
    let characters = '';

    if (hasUpperCase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasLowerCase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (hasNumbers) characters += '0123456789';
    if (includeChars) characters += includeChars;

    if (excludeChars) {
        characters = characters.split('').filter(char => !excludeChars.includes(char)).join('');
    }
    // 删去空格或者其他特殊不可见字符
    characters = characters.replace(/\s/g, '');

    // 删去characters中的重复字符
    characters = Array.from(new Set(characters)).join('');
    return characters;
}

/**
 * 生成随机字符串
 * @param options 生成随机字符串的选项
 * @returns 生成的随机字符串
 */
function generateRandomString(options: GenerateRandomStringOptions): string {
    let characters = getExcludeChars(options);

    // 生成随机字符串
    let result = '';
    for (let i = 0; i < options.length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

/**
 * 批量生成密码
 * @param options 生成随机字符串的选项
 * @param count 生成密码的个数，默认为1
 * @returns 生成的密码数组
 */
function generatePassword(options: GenerateRandomStringOptions, count: number = 1): string[] {
    const passwords = [];
    for (let i = 0; i < count; i++) {
        passwords.push(generateRandomString(options));
    }
    return passwords;
}


/**
 * 默认选项
 * @returns 默认选项对象
 */
function defaultOptions(): GenerateRandomStringOptions {
    return {
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumbers: true,
        includeChars: "!@#^*",
        excludeChars: "0oO1Il",
        length: 20
    }
}

export {generatePassword, getExcludeChars, defaultOptions, GenerateRandomStringOptions};