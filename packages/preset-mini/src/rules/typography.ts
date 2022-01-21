import type { Rule } from '@unocss/core'
import { toArray } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, handler as h } from '../utils'
import { colorableShadows } from './shadow'

const weightMap: Record<string, string> = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
  // int[0, 900] -> int
}

export const fonts: Rule<Theme>[] = [
  // family
  [/^font-(\w+)$/, ([, d], { theme }) => ({ 'font-family': theme.fontFamily?.[d] })],

  // size
  [/^text-(.+)$/, ([, s = 'base'], { theme }) => {
    const themed = toArray(theme.fontSize?.[s])
    if (themed?.[0]) {
      const [size, height = '1'] = themed
      return {
        'font-size': size,
        'line-height': height,
      }
    }

    return { 'font-size': h.bracket.rem(s) }
  }],
  [/^text-size-(.+)$/, ([, s]) => ({ 'font-size': h.bracket.cssvar.rem(s) })],

  // weights
  [/^(?:font|fw)-?([^-]+)$/, ([, s]) => ({ 'font-weight': weightMap[s] || h.number(s) })],

  // leadings
  [/^(?:leading|lh)-(.+)$/, ([, s], { theme }) => ({ 'line-height': theme.lineHeight?.[s] || h.bracket.cssvar.rem(s) })],

  // tracking
  [/^tracking-(.+)$/, ([, s], { theme }) => ({ 'letter-spacing': theme.letterSpacing?.[s] || h.bracket.cssvar.rem(s) })],

  // word-spacing
  [/^word-spacing-(.+)$/, ([, s], { theme }) => ({ 'word-spacing': theme.wordSpacing?.[s] || h.bracket.cssvar.rem(s) })],
]

export const tabSizes: Rule<Theme>[] = [
  [/^tab(?:-(.+))?$/, ([, s]) => {
    const v = h.bracket.cssvar.global.number(s || '4')
    if (v != null) {
      return {
        '-moz-tab-size': v,
        '-o-tab-size': v,
        'tab-size': v,
      }
    }
  }],
]

export const textIndents: Rule<Theme>[] = [
  [/^indent(?:-(.+))?$/, ([, s], { theme }) => ({ 'text-indent': theme.textIndent?.[s || 'DEFAULT'] || h.bracket.cssvar.fraction.rem(s) })],
]

export const textStrokes: Rule<Theme>[] = [
  // widths
  [/^text-stroke(?:-(.+))?$/, ([, s], { theme }) => ({ '-webkit-text-stroke-width': theme.textStrokeWidth?.[s || 'DEFAULT'] || h.bracket.cssvar.px(s) })],

  // colors
  [/^text-stroke-(.+)$/, colorResolver('-webkit-text-stroke-color', 'text-stroke')],
  [/^text-stroke-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-text-stroke-opacity': h.bracket.percent(opacity) })],
]

export const textShadows: Rule<Theme>[] = [
  [/^text-shadow(?:-(.+))?$/, ([, s], { theme }) => {
    const v = theme.textShadow?.[s || 'DEFAULT']
    if (v != null) {
      return {
        '--un-text-shadow': colorableShadows(v, '--un-text-shadow-color').join(','),
        'text-shadow': 'var(--un-text-shadow)',
      }
    }
    return { 'text-shadow': h.bracket.cssvar(s) }
  }],

  // colors
  [/^text-shadow-color-(.+)$/, colorResolver('--un-text-shadow-color', 'text-shadow')],
  [/^text-shadow-color-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-text-shadow-opacity': h.bracket.percent(opacity) })],
]
