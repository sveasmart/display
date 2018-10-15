/**
 * This module encapsulates some if the nitty gritty stuff around loading
 * config params.
 */
var config = require('config')

exports.loadConfig = function() {
  return {
    displayRpcPort: config.get('displayRpcPort'),

    button1NotificationPort: config.get('button1NotificationPort'),
    button2NotificationPort: config.get('button2NotificationPort'),
    button3NotificationPort: config.get('button3NotificationPort'),

    button0Tab: config.get('button0Tab'),
    button1Tab: config.get('button1Tab'),
    button2Tab: config.get('button2Tab'),
    startupMessage: config.get('startupMessage'),
    defaultTab: config.get('defaultTab'),
    returnToDefaultAfterXSeconds: config.get('returnToDefaultAfterXSeconds'),
    logCalls: config.get('logCalls') == "true"
  }
}
