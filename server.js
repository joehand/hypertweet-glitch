var bankai = require('bankai')
var http = require('http')
var path = require('path')
var hypertweet = require('hypertweet')
var discovery = require('hyperdiscovery')
var hypercore = require('hypercore')
var ram = require('random-access-memory')

var clientPath = path.join('public', 'client.js')
var assets = bankai(clientPath, {js: {t: ['sheetify/transform']}})

var key = process.env.KEY

createFeed(function (err, feed) {
  http.createServer(function (req, res) {
    switch (req.url) {
      case '/': return assets.html(req, res).pipe(res)
      case '/tweets': return streamTweets(req, res)
      case '/bundle.js': return assets.js(req, res).pipe(res)
      case '/bundle.css': return assets.css(req, res).pipe(res)
      default: return (res.statusCode = 404) && res.end('404 not found')
    }

    function streamTweets (req, res) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      
      var start = feed.length > 15 ? feed.length - 10 : 0
      console.log(start, feed.length)
      var stream = feed.createReadStream({live: true, start: start})
      stream.on('data', function (data) {
        // console.log('tweet sent')
        res.write('data: ' + JSON.stringify(data) + '\n\n')
      })
    }
  }).listen(process.env.PORT)
})


function createFeed (cb) {
  if (key) {
    // Read existing key + stream via network
    var feed = hypercore(ram, key, {sparse: true, valueEncoding: 'json'})
    feed.ready(function () {
      var swarm = discovery(feed) // connect to peers via discovery-swarm
      console.log('connecting to', feed.key.toString('hex'))
      feed.update(function () {
        // Inside feed.update to make sure we are connected
        console.log('connected')
        cb(null, feed)
      })
    })
  } else {
    // creating new stream via twitter
    hypertweet(ram, {
      // CHANGE ME and see what happens!
      streamUrl: 'https://stream.twitter.com/1.1/statuses/filter.json?track=javascript,npm,glitch.com,@glitch'
    }, function (err, feed) {
      if (err) return console.error(err)
      console.log('feed key', feed.key.toString('hex'))
      cb(null, feed)
    })
  }
}
