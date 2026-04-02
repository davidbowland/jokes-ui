const React = require('react')

const createIcon = (name) => {
  const Icon = ({ size, ...props }) => React.createElement('svg', { 'data-testid': `icon-${name}`, ...props })
  Icon.displayName = name
  return Icon
}

module.exports = {
  ChevronLeft: createIcon('ChevronLeft'),
  ChevronRight: createIcon('ChevronRight'),
  CircleUserRound: createIcon('CircleUserRound'),
  LogIn: createIcon('LogIn'),
  LogOut: createIcon('LogOut'),
  Shuffle: createIcon('Shuffle'),
  Volume2: createIcon('Volume2'),
  X: createIcon('X'),
  XCircle: createIcon('XCircle'),
}
