const React = require('react')

module.exports = {
  GatsbyImage: jest.fn(),
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({ activeClassName, activeStyle, getProps, innerRef, partiallyActive, ref, replace, to, ...rest }) =>
      React.createElement('a', {
        ...rest,
        href: to,
      }),
  ),
  navigate: jest.fn(),
  StaticImage: jest.fn(),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
}
