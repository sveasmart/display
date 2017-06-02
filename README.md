# Display

This is a an RPC wrapper around Adafruit display
https://www.npmjs.com/package/adafruit-mcp23008-ssd1306-node-driver

The purpose is to allow multiple processes to talk to the same
display without running into concurrency problems.

## How to use it

Start it up using `npm start`

Then connect to it using RPC2
https://www.npmjs.com/package/json-rpc2

Example:

```
var rpc = require('json-rpc2');

var client = rpc.Client.$create(7890, 'localhost');

client.call('writeText', ['hi!'], function(err, result) {
  if (err) {
    throw err
  }
  console.log("Successfully called writeText!")
})
```

## Configuration

You can configure things like which port it should listen to,
how buttons can be used to switch between tabs,
which startup message to show, and stuff like that.

Check config/default.yml for details

Override any params by creating a config/local.yml

## API

The API matches
https://www.npmjs.com/package/adafruit-mcp23008-ssd1306-node-driver

All the DisplayDriver methods are exposed as RPC functions,
and are called in the same way as the example above.