const stringUtil = require("./string-util")

/*
  Wraps all calls to the display and keeps track of the state of the display.
  Draws an ASCII version of the display on the console after each update.

  Internal data format for keeping track of state:

  content = {
    "tab0": {
      rows: [
        "This is row 1",
        "This is row 2"
      ]
    }

    "tab1": {...}
  }

 */

const rowCount = 8
const columnCount = 16

class DisplayWrapper {
  constructor(display, defaultTab) {
    this.display = display
    this.defaultTab = defaultTab
    this.content = {}
  }

  getTab() {
    return this.display.currentTab
  }
  
  showTab(tab) {
    this.display.showTab(tab)

    this.showOnConsole()
  }

  clearAllTabs() {
    this.display.clearAllTabs()

    this.content = {}

    this.showOnConsole()
  }

  clear(tab = this.defaultTab) {
    this.display.clear(tab)

    this.content[tab] = []

    this.showOnConsole()
  }

  clearRow(row, tab = this.defaultTab) {
    this.display.clearRow(row, tab)

    const tabContent = this._getOrCreateTabContent(tab)
    tabContent[row] = ""
    
    this.showOnConsole()
  }

  setQrCode(text, whiteOnBlack, tab = this.defaultTab) {
    this.display.setQrCode(text, whiteOnBlack, tab)

    this._writeText("++++++++", 0, 0, false, tab)
    this._writeText("++++++++", 0, 1, false, tab)
    this._writeText("++++++++", 0, 2, false, tab)
    this._writeText("+  QR  +", 0, 3, false, tab)
    this._writeText("+ CODE +", 0, 4, false, tab)
    this._writeText("++++++++", 0, 5, false, tab)
    this._writeText("++++++++", 0, 6, false, tab)
    this._writeText("++++++++", 0, 7, false, tab)

    this.showOnConsole()

  }

  setImage(pix, maxX = 128, tab = this.defaultTab) {
    this.display.setImage(pix, maxX, tab)
  }
  
  setTexts(lines, tab = this.defaultTab) {
    this.display.setTexts(lines, tab)

    const tabContent = []
    for (let row = 0; row < rowCount; ++row) {
      tabContent[row] = truncate(lines[row])
    }
    this.content[tab] = tabContent
    
    this.showOnConsole()
  }
  
  writeText(string, column, row, wrap, tab = this.defaultTab) {
    this.display.writeText(string, column, row, wrap, tab)

    this._writeText(string, column, row, wrap, tab)
    
    this.showOnConsole()
    
  }

  setRowText(string, row, wrap, tab = this.defaultTab) {
    this.display.setRowText(string, row, wrap, tab)

    const tabContent = this._getOrCreateTabContent(tab)
    tabContent[row] = ""
    
    this._writeText(string, 0, row, wrap, tab)

    this.showOnConsole()
  }

  showOnConsole() {
    let buf = ""

    let tabs = Object.keys(this.content)
    console.log("tabs", tabs)
    if (tabs.length == 0) {
      this.content[this.defaultTab] = []
      tabs = Object.keys(this.content)
    }


    //Draw the tab names
    for (let tabIndex = 0; tabIndex < tabs.length; ++tabIndex) {
      let tab = tabs[tabIndex]
      console.log("current tab", this.display.currentTab)
      if (tab == this.display.currentTab) {
        tab = '*' + tab + '*'
      }

      buf = buf + " " + tab
      buf = buf + " ".repeat(16 - tab.length)
    }
    buf = buf + '\n'


    //Draw the top line
    let horizontalLine = '-'.repeat(17)
    let longHorizontalLine = horizontalLine.repeat(tabs.length) + '-\n'
    buf = buf + longHorizontalLine

    //Draw each row
    for (let row = 0; row < rowCount; ++ row) {

      //Start with the left-side edge
      buf = buf + '|'

      //Loop through each tab
      for (let tabIndex = 0; tabIndex < tabs.length; ++tabIndex) {
        const tab = tabs[tabIndex]
        //Draw the row for this tab, plus the right-side edge
        const rowContentPadded = this._getTabRow(tab, row, true)
        buf = buf + rowContentPadded + "|"
      }

      //OK we're finished this row. Add a newline.
      buf = buf + '\n'
    }

    //Draw the bottom line
    buf = buf + longHorizontalLine

    console.log('\n' + buf)
  }

  _writeText(string, column, row, wrap, tab = this.defaultTab) {
    if (!column) {
      column = 0
    }
    if (!row) {
      row = 0
    }
    if (wrap == undefined || wrap == null) {
      wrap = true
    }
    string = String(string)

    assertInt("column", column, 0, columnCount - 1)
    assertInt("row", row, 0, rowCount - 1)

    for (var i = 0; i < string.length; ++i) {
      if (column + i >= columnCount) {
        //Row overflow!
        if (wrap) {
          //Wrap to next row.
          row = row + 1
          column = column - columnCount
        } else {
          //Truncate the row.
          break
        }
      }
      if (row >= rowCount) {
        //We are beneath the bottom of the display. Truncate.
        break
      }

      this._drawChar(string[i], column + i, row, tab)
    }
  }

  _getTabRow(tab, row, pad) {
    const tabContent = this._getOrCreateTabContent(tab)
    let rowContent = tabContent[row]
    if (!rowContent) {
      rowContent = ""
    }
    if (pad && (rowContent.length < columnCount)) {
      rowContent = rowContent + " ".repeat(columnCount - rowContent.length)
    }
    return rowContent
  }
  
  _drawChar(char, charX, charY, tab) {
    const tabContent = this._getOrCreateTabContent(tab)
    let rowContent = tabContent[charY]
    let updatedRowContent = stringUtil.setCharAt(rowContent, charX, char)
    tabContent[charY] = updatedRowContent
  }

  _getOrCreateTabContent(tab) {
    let tabContent = this.content[tab]
    if (!tabContent) {
      tabContent = []
      this.content[tab] = tabContent
    }
    return tabContent
  }
}


function truncate(row) {
  if (row) {
    return row.substring(0, columnCount)
  } else {
    return ""
  }
}

function assertInt(name, value, min, max) {
  console.assert(
    (Number.isInteger(value)) && (value >= 0) && (value <= max),
    `Invalid ${name}: ${value}. Should be ${min} - ${max}.`
  )
}

module.exports = DisplayWrapper