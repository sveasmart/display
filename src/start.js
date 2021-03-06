var rpc = require('json-rpc2');
var config = require('./display-config').loadConfig()
var DisplayWrapper = require('./display-wrapper')

var display = null
var buttons = null
var lastButtonPressTime = new Date()
var firstCallDone = false

function buttonPressed(buttonId) {
  lastButtonPressTime = new Date()
  let tab = config["button" + buttonId + "Tab"]
  if (tab && display) {
    console.log("Button " + buttonId + " pressed. Showing tab " + tab + ".")
    display.showTab(tab)
  } else {
    console.log("Button " + buttonId + " pressed. Ignoring it.")
  }
  sendButtonClickedViaRpc(buttonId)
}

function sendButtonClickedViaRpc(buttonId) {
  const notificationPort = config["button" + buttonId + "NotificationPort"]
  if (notificationPort) {
    console.log("Will send button notification to RPC port " + notificationPort)
    const rpcClient = rpc.Client.$create(notificationPort, '127.0.0.1');
    rpcClient.call("buttonClicked", [], (err, res) => {
      if (err) {
        console.log("Failed to send buttonClick event via RPC! Could be temporary.", err)
      }
    })
  }


}

function initDisplayAndButtons() {
  try {
    const adafruit = require('adafruit-mcp23008-ssd1306-node-driver')
    if (adafruit.hasDriver()) {
      console.log("Adafruit is available, so this device appears to have a display :)")
      display = new adafruit.DisplayDriver()
      buttons = new adafruit.ButtonDriver()
    } else {
      display = new adafruit.FakeDisplayDriver()
      buttons = new adafruit.FakeButtonDriver()
      console.log("Adafruit is not available, so we'll fake the display using the console")
    }
    if (config.simulateDisplayOnConsole) {
      display = new DisplayWrapper(display, config.defaultTab)      
    }
    display.showTab(config.defaultTab)
  } catch (err) {
    console.log("Failed to load Adafruit, so we'll fake the display using the console" + err)
  }
}

function listenToButtons() {
  try {
    if (buttons) {
      buttons.watchAllButtons(function(buttonId) {
        console.log("button pressed " + buttonId)
        buttonPressed(buttonId)
      })
    }
  } catch (err) {
    console.log("Couldn't listen to the display buttons, so I'll skip those.", err)
  }
}

function startRpcServerAndExposeDisplayMethods() {
  const server = rpc.Server.$create({
    'websocket': true, // is true by default
    'headers': { // allow custom headers is empty by default
      'Access-Control-Allow-Origin': '*'
    }
  });

  // listen creates an HTTP server on 127.0.0.1 only
  server.listen(config.displayRpcPort, '127.0.0.1');

  exposeDisplayMethod(server, "showTab")
  exposeDisplayMethod(server, "clearAllTabs")
  exposeDisplayMethod(server, "clear")
  exposeDisplayMethod(server, "clearRow")
  exposeDisplayMethod(server, "setQrCode")
  exposeDisplayMethod(server, "setImage")
  exposeDisplayMethod(server, "setTexts")
  exposeDisplayMethod(server, "writeText")
  exposeDisplayMethod(server, "setRowText")
}

function exposeDisplayMethod(server, methodName) {
  server.expose(methodName, (args, opts, callback) => {
    if (display) {
      if (!firstCallDone) {
        //This is the first call. Clear the startMessage so we start with a nice fresh empty screen.
        firstCallDone = true
        display.clear()
      }
      
      try {
        if (config.logCalls) {
          if (args) {
            console.log(methodName + "(" + args.join(", ") + ")")
          } else {
            console.log(methodName + "()")
          }
        }

        //Call the corresponoding method on the display object,
        //and flatten out the args array into a parameter list
        result = display[methodName](...args)
        callback(null, result)
      } catch (err) {
        console.log("Something went wrong!", err)
        callback(err)
      }
    } else {
      console.log("[no display] " + methodName + "(" + args.join(", ") + ")")
      callback(null, null)
    }
  });
}

function showStartupMessage() {
  if (display && config.startupMessage) {
    display.writeText(config.startupMessage, 0, 0, true, config.defaultTab)
  }
}

function returnToDefaultTabWhenNeeded() {
  if (display && config.defaultTab && config.returnToDefaultAfterXSeconds) {
    //Every seconds we check if it is time to show the default tab because of inactivity.
    setInterval(function() {
      if (display.getTab() != config.defaultTab) {
        const millisecondsSinceLastButtonPress = new Date().getTime() - lastButtonPressTime.getTime()
        if (millisecondsSinceLastButtonPress > config.returnToDefaultAfterXSeconds * 1000) {
          display.showTab(config.defaultTab)
        }
      }
    }, 1000)
  }
}

initDisplayAndButtons()
showStartupMessage()
listenToButtons()
startRpcServerAndExposeDisplayMethods()
returnToDefaultTabWhenNeeded()

console.log("logCalls = " + config.logCalls)
console.log("Display RPC server up and running on port " + config.displayRpcPort)

