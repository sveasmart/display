var chai = require("chai")
const expect = chai.expect

const stringUtil = require("../src/string-util")

describe("string-util", function() {
  it("setCharAt", function() {
    expect(stringUtil.setCharAt("hi", 1, "o")).to.equal("ho")
    expect(stringUtil.setCharAt("hi", 3, "o")).to.equal("hi o")
    expect(stringUtil.setCharAt("", 3, "o")).to.equal("   o")
    expect(stringUtil.setCharAt(null, 3, "o")).to.equal("   o")
    expect(stringUtil.setCharAt(undefined, 3, "o")).to.equal("   o")
  })
})