import {JSDOM} from 'jsdom'
import * as R from 'ramda'

export function sanitize(html: string): string[] {
  const textNode = (node: Node): boolean => {
    if (!node.firstChild) {
      return false
    }
    return node.firstChild.nodeType === node.TEXT_NODE
  }
  const breathe = (x: string) => `${x}, `
  const useless = (name: string) => ['HTML', 'HEAD', 'BODY', 'FIGURE', 'IMG', 'FIGCAPTION'].some(R.equals(name))
  const substitution = R.compose(
    breathe,
    R.cond([
      [R.equals('H3'), R.always('제목')],
      [R.equals('H4'), R.always('부제')],
    ])
  )
  const needReplace = (node: Node) => ['H3', 'H4',].some(t => t === node.nodeName)
  const replace = R.cond([
    [needReplace, (node: Node) => substitution(node.nodeName) + node.textContent],
    [R.T, (node: Node) => node.textContent]
  ])

  return elements(html)
    .filter(textNode)
    .filter(R.compose(R.not, useless, R.prop('nodeName')))
    .map(replace)
    .reduce((ret, curr, index, array) => {
      const lastIndex = R.length(ret) - 1
      const total = R.add(ret[lastIndex].length, curr.length)

      if (total > 1500) {
        ret.push(curr)
      } else {
        ret[lastIndex] += curr
      }
      return ret
    }, [''])
}

function elements(html: string): Node[] {
  const dom = new JSDOM(html)
  const elements = dom.window.document.querySelectorAll('*')

  return Array.from(elements.values())
}

