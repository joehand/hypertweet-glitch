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
          <h2 class="mt2 mb0 f6 fw4 ttu tracked"><a class="link dim" href="https://glitch.com/edit/#!/hypertweet?path=README.md:1:0">View on Glitch!</a></h2>
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
      if (data.info) {
        if (data.key) {
          state.feedName = 'Tracking external hypertweet feed'
          return
        } else if (data.url.indexOf('statuses/filter') > -1) {
          var tracking = data.url.split('track=')[1].split('&')[0].split(',') // lol
          if (tracking.length) state.feedName = `Tracking terms: ${tracking.join(' ')}`
          else state.feedName = `Filtered Feed: ${data.url.split('?')[0]}`
          return
        } else if (data.url.indexOf('user.json') > -1) {
          state.feedName = 'Viewing Your Feed' 
          return
        }
        state.feedName = 'Sample of All Tweets'
        return
      }
      // console.log('new tweet', data)
      state.tweets.unshift(data)
      bus.emit('render')
    })
}
