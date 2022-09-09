const fs = require('fs')
const path = require('path')

const prettier = require('prettier')
const colors = require('tailwindcss/colors')

const generatedFile = path.join(__dirname, '../Sources/TailwindColor', 'TailwindColor.swift')

const processedColors = Object.keys(colors)
  .filter(color => ![
    // invalid colors
    'inherit',
    'current',
    'transparent',
    'black',
    'white',

    // deprecated color group
    'blueGray',
    'coolGray',
    'lightBlue',
    'trueGray',
    'warmGray'
  ].includes(color))
  .sort()
  .map(color => {
    if (typeof colors[color] === 'string') {
      return [[color, colors[color]]]
    } else {
      return Object.entries(colors[color]).map(([key, value]) => {
        return [`${color}${key}`, value]
      })
    }
  })

const fileContent = `
import SwiftUI

public struct TailwindColor {
${processedColors.map(colorGroup => {
  return colorGroup.map(([key, value]) => `  public static var ${key} = Color(hex: "${value}")`).join('\n')
}).join('\n\n')}
}
`

fs.writeFileSync(generatedFile, fileContent)
