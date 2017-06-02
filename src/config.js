/**
 * This module encapsulates some if the nitty gritty stuff around loading
 * config params.
 */

var config = require('config')

loadConfig("displayRpcPort")
loadConfig("button0Tab", null)
loadConfig("button1Tab", null)
loadConfig("button2Tab", null)
loadConfig("startupMessage", null)
loadConfig("defaultTab", "default")
loadConfig("returnToDefaultAfterXSeconds", null)

/**
 * Loads the given config param and stores it
 * as a field in the config object.
 * If the param is missing, it will either return the default value (if given)
 * or throw an exception.
 */
function loadConfig(paramName, defaultValue) {
  config[paramName] = getConfig(paramName, defaultValue)
}

/**
 * Returns the given config param.
 * If the param is missing, it will either return the default value (if given)
 * or throw an exception.
 */
function getConfig(paramName, defaultValue) {
  if (defaultValue !== undefined) {
    if (config.has(paramName)) {
      return config.get(paramName)
    } else {
      return defaultValue
    }
  } else {
    return config.get(paramName)
  }
}

module.exports = config