var assert = require('assert')
var _ = require('underscore')

function Cat (name, breed) {
  this.name = name
  this.breed = breed
}

Cat.prototype.sayName = function () {
  return this.name
}

Cat.prototype.sayBreed = function () {
  return this.breed
}

function Dog (name, breed) {
  this.name = name
  this.breed = breed
}

_.extend(Dog.prototype, Cat.prototype)

var cat = new Dog('minx', 'tabby')
var dog = new Dog('wilmer', 'huskey')

assert.equal(cat.sayName, dog.sayName)
assert.equal(cat.sayName(), 'minx')
assert.equal(dog.sayName(), 'wilmer')
