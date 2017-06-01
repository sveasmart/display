var rpc = require('json-rpc2');

var display = null
var buttons = null


var server = rpc.Server.$create({
  'websocket': true, // is true by default
  'headers': { // allow custom headers is empty by default
    'Access-Control-Allow-Origin': '*'
  }
});

function add(args, opt, callback) {
  callback(null, args[0] + args[1]);
}

function writeText(args, opt, callback) {
  const text = args[0]
  console.log("writeText(" + text + ")")
  if (display) {
    display.writeText(text)
  } else {
    console.log("no display")
  }
  callback(null, "Got " + text)
}

server.expose('add', add);
server.expose('writeText', writeText);

// you can expose an entire object as well: 



// listen creates an HTTP server on localhost only 
server.listen(8000, 'localhost');


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


console.log("Listening on port 8000")