var rpc = require('json-rpc2');
var config = require('config')
var display = null
var buttons = null

const displayRpcPort = config.get("displayRpcPort")

var server = rpc.Server.$create({
  'websocket': true, // is true by default
  'headers': { // allow custom headers is empty by default
    'Access-Control-Allow-Origin': '*'
  }
});

// listen creates an HTTP server on localhost only 
server.listen(displayRpcPort, 'localhost');


function buttonPressed(buttonId) {
  if (display) {
    display.writeText("Button " + buttonId + " pressed")
  }
}

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
} catch (err) {
  console.log("Failed to load Adafruit, so we'll fake the display using the console" + err)
}

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

function expose(methodName) {
  server.expose(methodName, (args, opts, callback) => {
    try {
      result = display[methodName](...args)
      callback(null, result)
    } catch (err) {
      callback(err)
    }
  });

}
expose("showTab")
expose("clearAllTabs")
expose("clear")
expose("clearRow")
expose("setQrCode")
expose("setImage")
expose("setTexts")
expose("writeText")



console.log("Listening on port 8000")