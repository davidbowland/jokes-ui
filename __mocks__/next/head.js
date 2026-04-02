const React = require('react')

const Head = ({ children }) => {
  React.useEffect(() => {
    const titleEl = React.Children.toArray(children).find((child) => child && child.type === 'title')
    if (titleEl && titleEl.props && titleEl.props.children) {
      document.title = titleEl.props.children
    }
  })
  return null
}

module.exports = Head
module.exports.default = Head
