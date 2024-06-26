import { addPaletteToHTML, addThemeClassToHTML, generatePalette } from './core'

/**
 * 初始化主题
 * @param colorConfig
 */
function initTheme(colorConfig) {
  const colorPalette = generatePalette(colorConfig)
  addPaletteToHTML(colorPalette)
  addThemeClassToHTML()
}

/**
 * 主题设置
 */
const themeSetting = new Proxy(
  {
    colorConfig: new Proxy(
      {
        primaryColor: '#1890ff',
        minLight: 10,
        maxLight: 90,
      },
      {
        set: function(target, property, value) {
          target[property] = value
          const colorPalette = generatePalette(themeSetting.colorConfig)
          addPaletteToHTML(colorPalette)
          return true
        },
      },
    ),
    darkMode: true,
  },
  {
    set: function(target, property, value) {
      target[property] = value
      if (property === 'colorConfig') {
        const colorPalette = generatePalette(themeSetting.colorConfig)
        addPaletteToHTML(colorPalette)
        return true
      }

      if (property === 'darkMode') {
        document.documentElement.classList.toggle('dark', value)
      }
      return true
    },
  },
)

export { initTheme, themeSetting }
