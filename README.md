Welcome to the HyperTweet Glitch BETALPHA
=========================

https://github.com/joehand/hypertweet-glitch

A fun project using glitch and [hypertweet](https://github.com/joehand/hypertweet). Displays your tweets in realtime. Remix and change how you display your tweets. The css world is your oyster.

Made possible by the awesome work of the [Dat project](https://datproject.org).

Setup a Remix
------------

Super easy to remix and stream your own twitter feed! Check out the `.sample.env` for more details on what you need.

### Option 1: Glitch Storage

Store your tweets on glitch. This is mostly a temporary solution and the glitch storage can fill up quickly. Get a Twitter API token and get started!

Your hypercore tweet feed is stored in the `.data` folder which is not shared when you remix. **Warning:** Glitch goes a bit crazy when you run out of storage and deletes any files you edit.

### Option 2: Stream from Outside Server

Set up hypertweet on a server. This will let you store as much as you want! Start hypertweet on your server and set the `KEY` environment variable in glitch.

## See Also

* [hypertweet](https://github.com/joehand/hypertweet) - streaming twitter -> hypercore
* [hypercore](https://github.com/mafintosh/hypercore) - secure, distributed, append-only streams
* [choo](https://github.com/yoshuawuyts/choo) - A 4kb framework for creating sturdy frontend applications (and fun!)
* [tachyons](tachyons.io) - css toolkit
