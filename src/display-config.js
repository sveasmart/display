/**
 * This module encapsulates some if the nitty gritty stuff around loading
 * config params.
 */
var config = require('config')

exports.loadConfig = function() {
  return {
    displayRpcPort: config.get('displayRpcPort'),
    button0Tab: config.get('button0Tab'),
    button1Tab: config.get('button1Tab'),
    button2Tab: config.get('button2Tab'),
    startupMessage: config.get('startupMessage'),
    defaultTab: config.get('defaultTab'),
    returnToDefaultAfterXSeconds: config.get('returnToDefaultAfterXSeconds'),
    logCalls: getBool('logCalls'),
    simulateDisplayOnConsole: getBool('simulateDisplayOnConsole')
  }
}

/**
 * Gets a config param, and fails if it doesn't exist.
 */
function get(name) {
  const value = config.get(name)
  console.assert(value != null && value != undefined, "Missing config param " + name)
  return value
}


/**
 * Gets a config param and turns it into a string. Fails if doesn't exist.
 */
function getString(name) {
  const value = "" + get(name)
  console.assert(value.trim() != "", "Empty config param " + name)
  return value
}


function getBool(name) {
  const value = getString(name).trim().toLowerCase()
  if (value == "true") {
    return true
  } else if (value == "false") {
    return false
  } else {
    throw new Error(name + " was " + getString(name) + ", but I expected true/false")
  }
}