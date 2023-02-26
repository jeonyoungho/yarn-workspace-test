import {get} from 'https'
import * as FeedMe from 'feedme'

export function getFeed(id: string): Promise<FeedMe.Document> {
  return new Promise(resolve => {
    get(`https://medium.com/feed/${id}`, res => {
      const parser = new FeedMe(true)

      res.pipe(parser)
      parser.on('end', () => {
        resolve(parser.done())
      })
    })
  })
}

