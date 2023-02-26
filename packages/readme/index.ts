import {mp3} from 'speech'
import foo from "speech";
import * as fs from 'fs'
import {getFeed} from '../feed'
import {sanitize} from '../html'
import * as filenamify from 'filenamify'
import {promisify} from 'util'

const writeFile = promisify(fs.writeFile)

export default async function main(mediumId: string, index?: number) {
  const {items} = await getFeed(mediumId)
  const feeds = typeof index === 'number'
    ? items.slice(index, index + 1)
    : items

  await Promise.all(
    feeds.map(feed => {
      const {title, 'content:encoded': content} = feed
      const santitized = sanitize(content)
      const fileName = filenamify(title)

      console.log(santitized.length, 'chunks')

      return Promise.all(
        santitized.map(async (chunk, index) => {
          const mp3FileName = `${fileName}-${index}.mp3`
          const stream = await mp3(chunk)

          await writeFile(mp3FileName, stream)
          console.log('created:', mp3FileName)
        })
      )
    })
  )

  console.log('done!');
  console.log("foo: " + foo)
}

