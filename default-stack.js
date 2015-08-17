var chalk = require('chalk')
var _ = require('lodash')
var PrettyError = require('pretty-error')
var ParsedError = require('pretty-error/lib/parsed-error')

/** pretty error normal theme */
function defaultStack (err, pe) {
  pe = defaultStack.defaultPe(pe)
  var render = pe.render(err)
  return defaultStack.postRender(render)
}

/** object of all the PrettyError styles set to default */
defaultStack.nullStyle = {
  display: 'inline',
  background: 'none',
  color: 'none',
  bullet: 'none',
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingTop: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: 0,
  marginTop: 0
}

/** an array of all the PrettyError selectors */
defaultStack.selectors = [
  'pretty-error',
  'pretty-error > header',
  'pretty-error > header > title > kind',
  'pretty-error > header > title > wrapper',
  'pretty-error > header > colon',
  'pretty-error > header > message',
  'pretty-error > trace',
  'pretty-error > trace > item',
  'pretty-error > trace > item > header',
  'pretty-error > trace > item > header > pointer > file',
  'pretty-error > trace > item > header > pointer > colon',
  'pretty-error > trace > item > header > pointer > line',
  'pretty-error > trace > item > header > what',
  'pretty-error > trace > item > footer',
  'pretty-error > trace > item > footer > addr',
  'pretty-error > trace > item > footer > extra'
]

/** a blank theme that is fully unthemed */
defaultStack.generateBlankTheme = function (style, selectors) {
  style = style || defaultStack.nullStyle
  selectors = selectors || defaultStack.selectors
  return _.chain(selectors)
  .map(function (selector) {
    return [selector, style]
  })
  .object()
  .value()
}

/** fully unthemed PrettyError */
defaultStack.blankTheme = defaultStack.generateBlankTheme()

/** styling to get normal error */
defaultStack.defaultChildTheme = {
  'pretty-error > header > colon': {
    marginRight: 1
  },
  'pretty-error > trace': {
    display: 'block',
    marginLeft: 4
  },
  'pretty-error > trace > item': {
    display: 'block',
    bullet: '"at"'
  },
  'pretty-error > trace > item > header > pointer > file': {
    display: 'none'
  },
  'pretty-error > trace > item > header > pointer > colon': {
    display: 'none'
  },
  'pretty-error > trace > item > header > pointer > line': {
    display: 'none'
  },
  'pretty-error > trace > item > header > what': {
    paddingLeft: 1
  }
}

/** merge two themes */
defaultStack.mergeThemes = function (parentTheme, childTheme) {
  parentTheme = parentTheme || defaultStack.blankTheme
  childTheme = childTheme || defaultStack.defaultChildTheme
  return _.mapValues(parentTheme, function (property, key) {
    if (childTheme[key]) return _.defaults(childTheme[key], property)
    return property
  })
}

defaultStack.defaultTheme = defaultStack.mergeThemes()

/** a full PrettyError theme, looks like a normal error */
defaultStack.defaultPe = function (pe) {
  pe = pe || new PrettyError()
  pe.appendStyle(defaultStack.defaultTheme)
  pe.filter(function (traceLine) {
    if (traceLine.what !== null) {
      traceLine.shortenedAddr = ' (' + traceLine.shortenedAddr + ')'
    }
  })
  return pe
}

/** get rid of color ANSI codes & last empty line */
defaultStack.postRender = function (prettyStack) {
  var prettyStackLines = chalk.stripColor(prettyStack).split('\n')
  var lastLine = _.last(prettyStackLines)
  if (lastLine === '') prettyStackLines.pop()
  return prettyStackLines.join('\n')
}

// bundled helpers

/** reverse the lines for the skip callback */
defaultStack.skipReverseLines = function (e, callback) {
  var parsedError = new ParsedError(e)
  var traceLines = parsedError.trace
  var traceLinesSkip = _.chain(traceLines)
  .reverse()
  .map(function (traceLine, lineNumber) {
    traceLine.skip = callback(traceLine, lineNumber)
    return traceLine
  })
  .reverse()
  .value()
  return function (traceLine, lineNumber) {
    return traceLinesSkip[lineNumber].skip
  }
}

/** skip the stack lines until a file  */
defaultStack.fileOnward = function (e, file) {
  var found = false
  return defaultStack.skipReverseLines(e, function (traceLine, lineNumber) {
    var pattern = new RegExp(file)
    if (traceLine.file) var match = traceLine.file.match(pattern)
    if (match) found = true
    return !found
  })
}

/** get the line:char from string */
defaultStack.parseLineChar = function (s) {
  if (s instanceof Error && s.message) s = s.message
  var pattern = /(\d+):(\d+)/
  var match = s.match(pattern)
  if (match) {
    match.lineChar = match[0]
    match.line = parseInt(match[1], 10)
    match.char = parseInt(match[2], 10)
    return match
  }
  return false
}

/** get the line:char from string */
defaultStack.fakeLine = function (fileName, lineChar) {
  return ['    at ', fileName, ':', lineChar].join('')
}

/** get the stack with the file lines */
defaultStack.stackParts = function (stack) {
  var stackLines = stack.split('\n')
  var buckets = {
    'frame': [],
    'lines': []
  }
  _.each(stackLines, function (stackLine) {
    var pattern = /^\s\s\s\sat\s/
    var match = stackLine.match(pattern)
    if (match) {
      buckets.lines.push(stackLine)
    } else {
      buckets.frame.push(stackLine)
    }
  })
  return buckets
}

/** join the stack from with the lines */
defaultStack.stackJoin = function (stack) {
  return [
    stack.frame.join('\n'),
    stack.lines.join('\n')
  ].join('\n')
}

/** prepend the stack lines with a new line */
defaultStack.unshiftLines = function (stack, line$) {
  var lines = _.flatten([line$])
  stack = defaultStack.stackParts(stack)
  stack.lines = _.flatten([lines, stack.lines])
  return defaultStack.stackJoin(stack)
}

module.exports = defaultStack
