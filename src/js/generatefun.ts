// noinspection SpellCheckingInspection

interface GenerateRandomStringOptions {
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    includeChars?: string;
    excludeChars?: string;
    length: number;
}

function getExcludeChars(options: GenerateRandomStringOptions) {
    let {hasUpperCase, hasLowerCase, hasNumbers, includeChars, excludeChars} = options;
    let characters = '';

    if (hasUpperCase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasLowerCase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (hasNumbers) characters += '0123456789';
    if (includeChars) characters += includeChars;

    if (excludeChars) {
        // noinspection TypeScriptUnresolvedReference
        excludeChars += ' '
        characters = characters.split('').filter(char => !excludeChars.includes(char)).join('');
    }

    // 删去characters中的重复字符
    characters = Array.from(new Set(characters)).join('');
    return characters;
}

function generateRandomString(options: GenerateRandomStringOptions): string {
    let characters = getExcludeChars(options);

    let result = '';
    for (let i = 0; i < options.length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

function generatePassword(options: GenerateRandomStringOptions, count: number = 1): string[] {
    const passwords = [];
    for (let i = 0; i < count; i++) {
        passwords.push(generateRandomString(options));
    }
    return passwords;
}


function defaultOptions(): GenerateRandomStringOptions {
    return {
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumbers: true,
        includeChars: "!@#^*",
        excludeChars: "0oO1Il",
        length: 20
    }
};

export {generatePassword, getExcludeChars, defaultOptions, GenerateRandomStringOptions};