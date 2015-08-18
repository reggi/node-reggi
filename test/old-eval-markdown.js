// var path = require('path')
// // var assert = require('assert')
// var DESC = path.basename(__filename, path.extname(__filename))
// var evalMarkdown = require('../eval-markdown')
//
// /* global describe, it */
//
// // describe(DESC, function () {
//
//   return evalMarkdown('../docs/evalmd-prevent-eval.md')
//   .then(console.log)
//
// // })
//
//

// describe(DESC, function () {
//
//   describe('testMarkdown.replaceItems()', function () {
//   //
//   //   it('should interject 3 at 1', function () {
//   //
//   //     var arr = [
//   //       'a',
//   //       'b',
//   //       'c',
//   //       'd',
//   //       'e'
//   //     ]
//   //
//   //     var sub = [
//   //       '1',
//   //       '2',
//   //       '3'
//   //     ]
//   //
//   //     var output = [
//   //       'a',
//   //       '1',
//   //       '2',
//   //       '3',
//   //       'e'
//   //     ]
//   //
//   //     var result = testMarkdown.replaceItems(1, arr, sub)
//   //
//   //     assert.deepEqual(result, output)
//   //
//   //   })
//   //
//   //   it('should interject 3 at 0', function () {
//   //
//   //     var arr = [
//   //       'a',
//   //       'b',
//   //       'c',
//   //       'd',
//   //       'e'
//   //     ]
//   //
//   //     var sub = [
//   //       '1',
//   //       '2',
//   //       '3'
//   //     ]
//   //
//   //     var output = [
//   //       '1',
//   //       '2',
//   //       '3',
//   //       'd',
//   //       'e'
//   //     ]
//   //
//   //     var result = testMarkdown.replaceItems(0, arr, sub)
//   //
//   //     assert.deepEqual(result, output)
//   //
//   //   })
//   //
//   //
//   //   it('should interject 1 at 1', function () {
//   //
//   //     var arr = [
//   //       'a',
//   //       'b',
//   //       'c',
//   //       'd',
//   //       'e'
//   //     ]
//   //
//   //     var sub = [
//   //       '1'
//   //     ]
//   //
//   //     var output = [
//   //       'a',
//   //       '1',
//   //       'c',
//   //       'd',
//   //       'e'
//   //     ]
//   //
//   //     var result = testMarkdown.replaceItems(1, arr, sub)
//   //
//   //     assert.deepEqual(result, output)
//   //
//   //   })
//   //
//   //   it('should interject 1 at 0', function () {
//   //
//   //     var arr = [
//   //       'a',
//   //       'b',
//   //       'c',
//   //       'd',
//   //       'e'
//   //     ]
//   //
//   //     var sub = [
//   //       '1'
//   //     ]
//   //
//   //     var output = [
//   //       '1',
//   //       'b',
//   //       'c',
//   //       'd',
//   //       'e'
//   //     ]
//   //
//   //     var result = testMarkdown.replaceItems(0, arr, sub)
//   //
//   //     assert.deepEqual(result, output)
//   //
//   //   })
//   //
//   })
//
//   describe('testMarkdown.multiIndexOf()', function () {
//
//     it('should work', function () {
//
//       var file = [
//         '# Hello World',
//         '',
//         '```javascript',
//         'var foo = "foo"',
//         '```',
//         '',
//         '```javascript',
//         'var foo = "foo"',
//         '```',
//         '',
//         '```javascript',
//         'var foo = "foo"',
//         '```',
//         ''
//       ].join('\n')
//
//       var substr = [
//         '```javascript',
//         'var foo = "foo"',
//         '```'
//       ].join('\n')
//
//       var result = testMarkdown.multiIndexOf(file, substr)
//
//       assert.deepEqual(result, [ 15, 30, 80 ])
//
//     })
//   })
//
// })
