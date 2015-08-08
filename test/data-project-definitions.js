var tests = [
  {
    'deps': ['underscore'],
    'root': './one.js',
    'modules': {
      './one.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './dir/two.js',
    'modules': {
      './dir/two.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './three.js',
    'modules': {
      './three.js': ['./four.js'],
      './four.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './five.js',
    'modules': {
      './five.js': ['./dir/six.js'],
      './dir/six.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './seven.js',
    'modules': {
      './seven.js': ['./eight.js'],
      './eight.js': ['./nine.js'],
      './nine.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './ten.js',
    'modules': {
      './ten.js': ['./dir/eleven.js'],
      './dir/eleven.js': ['./dir/twelve.js'],
      './dir/dir/twelve.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './thirteen.js',
    'modules': {
      './thirteen.js': ['./dir/dir/dir/dir/fourteen.js'],
      './dir/dir/dir/dir/fourteen.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './fifteen.js',
    'modules': {
      './fifteen.js': ['./dir/dir/dir/dir/sixteen.js'],
      './dir/dir/dir/dir/sixteen.js': ['../../../../foo/seventeen.js'],
      './foo/seventeen.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './eighteen.js',
    'modules': {
      './eighteen.js': ['./nineteen.js'],
      './nineteen.js': ['./twenty.js'],
      './twenty.js': ['underscore']
    }
  }
]

module.exports = tests
