// noinspection SpellCheckingInspection,JSUnusedGlobalSymbols

export interface Suggestion {
    seriousness: Seriousness
    title: string
    content: string
}

enum Seriousness {
    default = "default", // 无色
    primary = "primary", // 蓝色
    success = "success", // 绿色
    info = "info", // 灰色
    warning = "warning", // 黄色
    danger = "danger" // 红色
}

/**
 * 常见弱密码列表
 */
const commonPasswords = new Set([
    '123456', '123456789', 'password', '12345678', '111111', '123123',
    'qwerty', 'iloveyou', 'p@ssword', 'secret', 'admin', 'root'
]);


/**
 * 检查密码长度
 */
function checkLength(password: string): Suggestion[] {
    const length = password.length;
    if (length === 0) {
        return [];
    }
    if (length < 8) {
        return [{
            seriousness: Seriousness.danger,
            title: '长度：很短',
            content: '您的密码很短。密码越长，它就越安全。我们建议至少使用16个字符。'
        }];
    }
    if (length < 16) {
        return [{
            seriousness: Seriousness.warning,
            title: '长度：中等',
            content: '您的密码可以更长一些以增加安全性。我们建议至少使用16个字符。'
        }];
    }
    return [{
        seriousness: Seriousness.success,
        title: '长度：较长',
        content: '您的密码长度超过16个字符，这使它更安全！'
    }];
}

/**
 * 检查字符多样性
 */
function checkCharacterDiversity(password: string): Suggestion[] {
    const suggestions: Suggestion[] = [];

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);

    const diversityScore = [hasLowerCase, hasUpperCase, hasNumbers, hasSymbols].filter(Boolean).length;

    if (/^\d+$/.test(password)) {
        suggestions.push({
            seriousness: Seriousness.danger,
            title: '字符多样性：只有数字',
            content: '您的密码仅包含数字。这大大减少了可能组合的数量，使其非常容易被破解。'
        });
    } else if (/^[a-zA-Z]+$/.test(password)) {
        suggestions.push({
            seriousness: Seriousness.warning,
            title: '字符多样性：只有字母',
            content: '您的密码仅包含字母。添加数字和符号可以显著提高其强度。'
        });
    } else if (!hasSymbols) {
        suggestions.push({
            seriousness: Seriousness.warning,
            title: '字符多样性：缺少符号',
            content: '建议您的密码包含特殊符号（例如 !@#$）。这可以增加密码的复杂性。'
        });
    } else if (diversityScore <= 3) {
        suggestions.push({
            seriousness: Seriousness.warning,
            title: '字符多样性：可以改进',
            content: '建议您的密码同时包含大小写字母、数字和特殊符号（例如 !@#$）。'
        });
    }

    if (diversityScore >= 4) {
        suggestions.push({
            seriousness: Seriousness.success,
            title: '字符多样性：很好',
            content: '您的密码包含了大小写字母、数字和符号，非常安全。'
        });
    }

    return suggestions;
}

/**
 * 检查常见模式（日期、电话、字典词等）
 */
function checkCommonPatterns(password: string): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // 检查是否为纯数字，并符合日期或电话号码的模式
    if (/^\d+$/.test(password)) {
        // 可能是日期 (YYYYMMDD)
        if (password.length === 8 && (password.startsWith('19') || password.startsWith('20'))) {
            suggestions.push({
                seriousness: Seriousness.danger,
                title: '可能是日期',
                content: '您的密码看起来可能是日期。如果是的，而且它有个人意义，那么人们可能很容易猜到。'
            });
        }
        // 可能是中国大陆手机号
        if (password.length === 11 && password.startsWith('1')) {
            suggestions.push({
                seriousness: Seriousness.danger,
                title: '可能是电话号码',
                content: '您的密码看起来可能是电话号码。如果是的，而且它有个人意义，那么人们可能很容易猜到。'
            });
        }
    }

    // 检查是否为常见弱密码
    if (commonPasswords.has(password.toLowerCase())) {
        suggestions.push({
            seriousness: Seriousness.danger,
            title: '可能是一句话',
            content: '您的密码是已知的常见弱密码（如 "password", "123456"）。它可能会在几秒钟内被破解。'
        });
    }

    return suggestions;
}

/**
 * 检查重复字符
 */
function checkRepetition(password: string): Suggestion[] {
    if (password.length < 4) {
        return []; // 对于太短的密码，此检查意义不大
    }

    const uniqueChars = new Set(password.split('')).size;
    const repetitionRatio = uniqueChars / password.length;

    // 如果唯一字符的比例太低（例如，少于50%），则认为重复度高
    if (repetitionRatio < 0.5) {
        return [{
            seriousness: Seriousness.warning,
            title: '太多重复',
            content: '重复的字符或模式（例如 "aaaaaa" 或 "abcabcabc"）可以使您的密码更容易被预测。'
        }];
    }

    return [];
}


/**
 * 根据给定的密码字符串生成常用的密码建议。
 * @param password 要分析的密码字符串。
 * @returns 一个包含密码建议的 Suggestion 对象数组。
 */
export function generatePasswordSuggestions(password: string): Suggestion[] {
    if (!password) {
        return [];
    }

    const allSuggestions = [
        ...checkLength(password),
        ...checkCharacterDiversity(password),
        ...checkCommonPatterns(password),
        ...checkRepetition(password),
    ];

    // 过滤掉重复的建议标题（例如，多样性检查和模式检查都可能针对纯数字密码提出建议）
    const uniqueTitles = new Set<string>();
    return allSuggestions.filter(suggestion => {
        if (uniqueTitles.has(suggestion.title)) {
            return false;
        }
        uniqueTitles.add(suggestion.title);
        return true;
    });
}

