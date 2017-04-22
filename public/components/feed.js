var html = require('choo/html')
var css = require('sheetify')
var moment = require('moment')

var feedStyles = css`
  :host {
  }
`

module.exports = Feed

function Feed (state, emit) {
  if (!state.tweets || !state.tweets.length) return html`<div>loading...</div>`
  var tweets = state.tweets
  return html`
    <main class="vh-100 w-70 fl pv4 overflow-y-scroll"> 
      <h3 class="tc w-100 f5">${state.feedName}</h3>
      <div class="mw6 center">
      ${tweets.map((tweet) => {
        return aTweet(tweet)
      })}
      </div>
    </main>
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
