var html = require('choo/html')
var choo = require('choo')
var log = require('choo-log')
var ess = require('event-source-stream')
var css = require('sheetify')
var moment = require('moment')

css('tachyons')
css('./style.css')

var app = choo()
app.use(log())
app.use(tweetStream)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  if (!state.tweets) state.tweets = []
  return html`
    <body class="overflow-hidden">
      <article class="vh-100 fl dt w-30 bg-dark-pink">
        <div class="dtc v-mid tc white ph3 ph4-l">
          <h1 class="mt2 mb0 baskerville i fw1 f1">Hyper Tweeet</h1>
          <h2 class="mt2 mb0 f6 fw4 ttu tracked">Streamed Tweets via <a class="link dim" href="https://datproject.org">Hypercore</a></h2>
        </div>
      </article>
      <main class="vh-100 w-70 fl pv4 overflow-y-scroll">
        <div class="mw6 center">
        ${state.tweets.slice(0).reverse().map((tweet) => {
          // o/ so lazy + slow
          return aTweet(tweet)
        })}
        </div>
      </main>
    </body>
  `

  function aTweet (tweet) {
    return html`
      <article class="w-100 bb b--black-05 pb2 mt2">
        <div class="dt w-100">
          <div class="dtc w2 w3-ns v-mid">
            <img src="${tweet.user.profile_image_url_https}" class="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
          </div>
          <div class="dtc v-mid pl3">
            <h1 class="f6 f5-ns fw6 lh-title black mv0">${tweet.user.name}</h1>
            <h2 class="f6 fw4 mt0 mb0 black-60">@${tweet.user.screen_name}</h2>
          </div>
          <div class="dtc v-mid black-60">
            <div class="w-100 tr">${moment(new Date(tweet.created_at)).fromNow()}</div>
          </div>
        </div>
        <div class="db f6 f5-ns lh-copy measure mv3">
          ${tweet.text}
        </div>
      </article>
    `
  }
}

function tweetStream (state, bus) {
  state.tweets = []
  ess('/tweets')
    .on('data', function (data) {
      data = JSON.parse(data)
      bus.emit('log:info', 'new tweet', data)
      state.tweets.push(data)
      bus.emit('render')
    })
}
