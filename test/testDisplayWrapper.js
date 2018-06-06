const DisplayWrapper = require("../src/display-wrapper")
const adafruit = require('adafruit-mcp23008-ssd1306-node-driver')

const display = new DisplayWrapper(new adafruit.FakeDisplayDriver(), "tab0")

display.showTab('tab0')

display.setTexts(["Hi there"])
/*


display.setTexts([
  "",
  "line2",
  "",
  "  indented",
  "1234123412341234TRUNCATEME",
  "line6",
  "line7",
  "line8",
  "line9"]
)


 /**
 * Gets a config param and turns it into a string. Fails if doesn't exist.
 */
function getString(name) {
  const value = "" + get(name)
  console.assert(value.trim() != "", "Empty config param " + name)
  return value
}
Text("writeText", 0, 0, false)

display.clearAllTabs()

display.writeText("truncatetest truncatetest", 0, 0, false)
display.writeText("wraptest wraptest", 0, 2, true)
display.writeText("longwraptest longwraptest longwraptest", 0, 4, true)
display.writeText("lastrowwraptest lastrowwraptest", 0, 7, true)

display.clearAllTabs()
display.writeText("wrap from middle of row", 4, 0, true)
display.writeText("truncate from middle of row", 4, 4, false)

display.writeText("another tab", 1, 1, false, "tab1")

display.showTab('tab1')

display.clear('tab1')

display.clearRow(0)

display.writeText("This is row 2", 0, 1, false, "tab1")
display.writeText("This is row 3", 0, 2, false, "tab1")
display.clearRow(1)
display.clearRow(1, "tab1")

display.setRowText("This is almost bottom row", 6)
