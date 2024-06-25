/**
 * 核心功能
 * @author pepedd864
 * @date 2024/6/26
 */
import { getHex, getHsl, mixColor } from '../utils/colord'
import { colord } from 'colord'

/**
 * 生成调色盘
 * @param colorConfig
 */
function generatePalette(colorConfig) {
  // 调色盘数值数组
  const colorPaletteNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const len = colorPaletteNumbers.length
  // 生成的颜色数组
  let colorPalette = []
  const min = colorConfig.minLight // 亮度最小值
  const max = colorConfig.maxLight // 亮度最大值
  // 每个部分之间相隔的亮度
  const part = (max - min) / 11 // 这个用于定位
  // 计算索引
  const hslC = getHsl(colorConfig.primaryColor)
  if (hslC.l < min) hslC.l = min
  if (hslC.l > max) hslC.l = max
  const index = len - Math.floor((hslC.l - min) / part) - 1
  // 添加到调色盘中
  colorPalette[index] = {
    num: colorPaletteNumbers[index],
    color: getHex(hslC),
    text: mixColor(hslC.l < 45 ? '#ffffff' : '#000000', getHex(hslC), 0.5),
  }
  // 根据当前值计算其他值
  for (let i = 0; i < len; i++) {
    if (i === index) {
      continue
    }
    const diff = i - index
    const newL = hslC.l - diff * part
    const newColor = colord({ ...hslC, l: Math.floor(newL) }).toHex()
    colorPalette[i] = {
      num: colorPaletteNumbers[i],
      color: newColor,
    }
  }

  // 计算字体颜色
  const midColor = colorPalette[Math.floor(len / 2)].color
  colorPalette = colorPalette.map((item) => {
    const color = colord(item.color)
    const text = mixColor(color.toHsl().l < 50 ? '#ffffff' : '#000000', midColor, 0.5)
    return {
      ...item,
      text,
    }
  })
  return colorPalette
}

/**
 * 添加调色盘CSS变量到style标签中
 * @param palette
 */
function addPaletteToHTML(palette) {
  function getCssVarStr(arr) {
    const cssVarArr = arr.map((item) => {
      const cssVarPrimary = `--primary-${item.num}-color:${item.color};\n`
      const cssVarImmersiveText = `--immersive-text-${item.num}-color:${item.text};\n`
      return cssVarPrimary + cssVarImmersiveText
    })
    return cssVarArr.join('')
  }

  const cssVarStr = getCssVarStr(palette)

  const innerHTML = `
    html {
        ${cssVarStr}
        --background-color: #fff;
        --text-color: #000;
    }
    html.dark {
        ${cssVarStr}
        --background-color: #1C1C1CFF;
        --text-color: #fff;
    }
    `
  updateStyleToEle('palette-colors', innerHTML)
}

/**
 * 添加自定义类名到style标签中
 */
function addThemeClassToHTML() {
  function getThemeClass() {
    const colorPaletteNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    const classStr = colorPaletteNumbers.map((num) => {
      return `.bg-primary-${num} {background-color:var(--primary-${num}-color);color:var(--immersive-text-${num}-color)}\n`
    })
    return classStr.join(' ')
  }

  const classStr = getThemeClass()
  updateStyleToEle('theme-class', `${classStr}`)
}

/**
 * 更新style标签内容
 * @param styleId
 * @param innerHTML
 */
function updateStyleToEle(styleId, innerHTML) {
  const style = document.querySelector(`#${styleId}`) || document.createElement('style')
  style.id = styleId
  style.innerHTML = innerHTML
  document.head.appendChild(style)
}

export { generatePalette, addPaletteToHTML, addThemeClassToHTML }
