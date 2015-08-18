var evalMarkdown = require('./test-markdown')

evalMarkdown('./docs/evalmd-file-eval.md')
.then(function (data) {
  console.log(data)
})
