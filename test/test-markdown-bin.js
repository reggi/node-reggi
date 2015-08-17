var _ = require('lodash')
// var util = require('util')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var nixt = require('nixt')
var chdirTemp = require('../test-chdir-temp')
var DESC = path.basename(__filename, path.extname(__filename))
var cmd = path.join(__dirname, '../bin/test-markdown.js')

/* global describe, it */

var tests = [
  // {
  //   'should': 'exit with code 1 when error thrown',
  //   'files': {
  //     'markdown.md': [
  //       '```javascript',
  //       "throw new Error('Meow.')",
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 ',
  //     'evalmd ERR! block 1 ',
  //     'evalmd ERR! Unhandled rejection Error: Meow. ',
  //     'evalmd ERR!     at ./markdown.md:2:7 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 1
  // },
  // {
  //   'should': 'exit with code 1 when process.exit',
  //   'files': {
  //     'markdown.md': [
  //       '```javascript',
  //       'process.exit(1)',
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 '
  //   ],
  //   'code': 1
  // },
  // {
  //   'should': 'exit with code 0 with empty block',
  //   'files': {
  //     'markdown.md': [
  //       '```javascript',
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 0
  // },
  // {
  //   'should': 'exit with code 0 empty block one space',
  //   'files': {
  //     'markdown.md': [
  //       '```javascript',
  //       '',
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 0
  // },
  // {
  //   'should': 'exit with code 0 when valid assertion',
  //   'files': {
  //     'markdown.md': [
  //       '```javascript',
  //       "var assert = require('assert')",
  //       'var x = true',
  //       'assert.equal(x, true)',
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 0
  // },
  // {
  //   'should': 'exit with code 1 when invalid assertion',
  //   'files': {
  //     'markdown.md': [
  //       '```javascript',
  //       "var assert = require('assert')",
  //       'var x = true',
  //       'assert.equal(x, false)',
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 ',
  //     'evalmd ERR! block 1 ',
  //     'evalmd ERR! Unhandled rejection AssertionError: true == false ',
  //     'evalmd ERR!     at ./markdown.md:4:8 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 1
  // },
  // {
  //   'should': 'exit with code 0 when self require',
  //   'files': {
  //     'package.json': {
  //       'name': 'super-duper',
  //       'main': './super-special-test.js'
  //     },
  //     'super-special-test.js': "module.exports = 'aloha'",
  //     'markdown.md': [
  //       '```javascript',
  //       "var assert = require('assert')",
  //       "var superDuper = require('super-duper')",
  //       "assert.equal(superDuper, 'aloha')",
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 0
  // },
  // {
  //   'should': 'exit with code 0 when self require without leading path',
  //   'files': {
  //     'package.json': {
  //       'name': 'super-duper',
  //       'main': 'super-special-test.js'
  //     },
  //     'super-special-test.js': "module.exports = 'aloha'",
  //     'markdown.md': [
  //       '```javascript',
  //       "var assert = require('assert')",
  //       "var superDuper = require('super-duper')",
  //       "assert.equal(superDuper, 'aloha')",
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running block 1 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 0
  // },
  // {
  //   'should': 'exit with code 0 with two blocks',
  //   'files': {
  //     'markdown.md': [
  //       '# Hello',
  //       '```javascript',
  //       "var assert = require('assert')",
  //       'var x = true',
  //       'assert.equal(x, true)',
  //       '```',
  //       '```javascript',
  //       "var assert = require('assert')",
  //       'var x = false',
  //       'assert.equal(x, false)',
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running blocks 1, 2 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 0
  // },
  // {
  //   'should': 'exit with code 0 with two blocks first throws',
  //   'files': {
  //     'markdown.md': [
  //       '# Hello',
  //       '```javascript',
  //       "throw new Error('Meow.')",
  //       '```',
  //       '```javascript',
  //       "var assert = require('assert')",
  //       'var x = false',
  //       'assert.equal(x, false)',
  //       '```'
  //     ]
  //   },
  //   'output': [
  //     'evalmd info it worked if it ends with ok ',
  //     'evalmd info ./markdown.md running blocks 1, 2 ',
  //     'evalmd ERR! block 1 ',
  //     'evalmd ERR! Unhandled rejection Error: Meow. ',
  //     'evalmd ERR!     at ./markdown.md:3:7 ',
  //     'evalmd info ok  '
  //   ],
  //   'code': 1
  // },
  {
    'should': 'exit 0 one block with spacing ',
    'files': {
      'markdown.md': [
        '',
        '',
        '',
        '',
        '```javascript',
        "var assert = require('assert')",
        'var x = false',
        'assert.equal(x, false)',
        '```'
      ]
    },
    'output': [
      'evalmd info it worked if it ends with ok ',
      'evalmd info ./markdown.md running block 1 ',
      'evalmd info ok  '
    ],
    'code': 0
  }
]

describe(DESC, function () {
  chdirTemp(false, true); if (!GLOBAL.fsmock) throw new Error('no mock')

  tests.forEach(function (test) {
    it(test.should, function (done) {
      if (test.files) {
        _.each(test.files, function (content, name) {
          content = (function () {
            if (Array.isArray(content)) return content.join('\n')
            if (typeof content === 'object') return JSON.stringify(content)
            return content
          }())
          fs.writeFileSync(name, content)
        })
      }
      nixt()
        .run(cmd + ' ' + './markdown.md')
        .expect(function (vals) {
          console.log(vals.stdout)
          console.log(vals.stderr)
          if (test.output) assert.equal(vals.stderr, test.output.join('\n'))
        })
        .code(test.code)
        .end(done)
    })
  })
})
