/**
 * 初始化主题
 * @param colorConfig
 */
declare function initTheme(colorConfig: any): void;
/**
 * 主题设置
 */
declare const themeSetting: {
    colorConfig: {
        primaryColor: string;
        minLight: number;
        maxLight: number;
    };
    darkMode: boolean;
};

export { initTheme, themeSetting };
