#! /usr/bin/env node

var minimist = require('minimist')
var ffmpeg = require('fluent-ffmpeg')
var ytdl = require('ytdl-core')

var args = minimist(process.argv.slice(2), {
  default: {
    format: 'mp3',
    bitrate: 128,
    seek: 0,
    duration: null
  }
})

var videoId = args._[0]
var reader = ytdl(formatUrl(videoId), {filter: 'audioonly'})
var writer = ffmpeg(reader)
  .format(args.format)
  .audioBitrate(args.bitrate)

if (args.seek) writer.seekInput(formatTime(args.seek))
if (args.duration) writer.duration(args.duration)

writer.output(process.stdout).run()

function formatUrl (id) {
  return 'https://www.youtube.com/watch?v=' + id
}

function formatTime (time) {
  var minutes = time.match(/(\d+)m/)
  var seconds = time.match(/(\d+)s/)
  return [
    minutes.length && padLeft(minutes[1], 2),
    seconds.length && padLeft(seconds[1], 2)
  ].filter(Boolean).join(':')
}

function padLeft (str, length) {
  while (str.length < length) str = '0' + str
  return str
}
