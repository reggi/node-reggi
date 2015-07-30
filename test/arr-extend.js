var chai = require("chai")
var expect = chai.expect

var arrExtend = require("../arr-extend")

describe("extend-array", function(){
  it("should extend the array", function(){
    var arr = [ { '231634908': 137875 },
                { '388252786': 150004 },
                { '333624027': 144107 },
                { '382758108': 149729 },
                { '384113458': 149803 },
                { '384844004': 149848 },
                { '405877005': 150481 },
                { '405877005': 150481 } ]
    var result = {
      '231634908': 137875,
      '388252786': 150004,
      '333624027': 144107,
      '382758108': 149729,
      '384113458': 149803,
      '384844004': 149848,
      '405877005': 150481,
      '405877005': 150481
    }
    expect(JSON.stringify(arrExtend(arr))).to.equal(JSON.stringify(result))
  })
})
