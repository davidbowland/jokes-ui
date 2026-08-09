const React = require('react')

// Tags next/head hoists into document.head alongside <title>
const HEAD_TAGS = ['link', 'meta', 'noscript', 'script', 'style']

const Head = ({ children }) => {
  React.useEffect(() => {
    const elements = React.Children.toArray(children).filter((child) => React.isValidElement(child))

    const titleEl = elements.find((child) => child.type === 'title')
    if (titleEl && titleEl.props.children) {
      document.title = titleEl.props.children
    }

    // Track what this instance added so unmount removes it and tests stay isolated
    const appended = elements
      .filter((child) => HEAD_TAGS.includes(String(child.type)))
      .map((child) => {
        const el = document.createElement(String(child.type))
        Object.entries(child.props).forEach(([name, value]) => {
          if (name !== 'children') {
            el.setAttribute(name, String(value))
          }
        })
        if (child.props.children) {
          el.textContent = child.props.children
        }
        document.head.appendChild(el)
        return el
      })

    return () => appended.forEach((el) => el.remove())
  })
  return null
}

module.exports = Head
module.exports.default = Head
