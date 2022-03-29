export function clearHtml(htmlContent: string): string {
  const node = document.createElement('div')
  node.innerHTML = htmlContent
  return node.textContent ?? ''
}
