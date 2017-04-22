var html = require('choo/html')
var choo = require('choo')
var log = require('choo-log')
var ess = require('event-source-stream')
var css = require('sheetify')

var feed = require('./components/feed')

css('tachyons')
css('./style.css')

var app = choo()
app.use(log())
app.use(tweetStream)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body class="overflow-hidden">
      <article class="vh-100 fl dt w-30 bg-dark-pink">
        <div class="dtc v-mid tc white ph3 ph4-l">
          <h1 class="mt2 mb0 baskerville i fw1 f1">Hyper Tweeet</h1>
          <h2 class="mt2 mb0 f6 fw4 ttu tracked">Streamed Tweets via <a class="link dim" href="https://datproject.org">Hypercore</a></h2>
        </div>
      </article>
      ${feed(state, emit)}
    </body>
  `
}

function tweetStream (state, bus) {
  state.tweets = []
  ess('/tweets')
    .on('data', function (data) {
      data = JSON.parse(data)
      bus.emit('log:info', 'new tweet', data)
      state.tweets.unshift(data)
      bus.emit('render')
    })
}
