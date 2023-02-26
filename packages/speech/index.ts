import * as AWS from 'aws-sdk'
import {AudioStream} from 'aws-sdk/clients/polly'

const VoiceId = 'Seoyeon'
const OutputFormat = 'mp3'
const SampleRate = '8000'
const polly = new AWS.Polly({
  region: 'ap-northeast-2'
})

export function mp3(Text: string): Promise<AudioStream> {
  return new Promise<AudioStream>(resolve => {
    polly.synthesizeSpeech({VoiceId, OutputFormat, SampleRate, Text}, (err, data) => {
      if (err) {
        console.error('speech', err)
        return resolve()
      }
      resolve(data.AudioStream)
    })
  })
}

const foo = "test";
export default foo;