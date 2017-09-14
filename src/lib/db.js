import firebase from 'firebase'
import { dbKeys, fireBaseConfig } from './consts'

let dbInstance = false

const getInstance = () => {
  if (!dbInstance) {
    try {
      firebase.initializeApp(fireBaseConfig)
    } catch (err) {
      // we skip the "already exists" message which is
      // not an actual error when we're hot-reloading
      if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
      }
    }
    dbInstance = firebase.database()
  }

  return dbInstance
}

export class DbManager {
  constructor () {
    this.db = getInstance()
  }

  async readStories () {
    const stories = await this.db.ref('story').once('value')
    return stories.val()
  }

  async getNewPostKeys () {
    return this.db.ref().child(dbKeys.story).push().key
  }

  async saveStories ({postKey, title, content, hashTags}) {
    const stories = await this.db.ref(`${dbKeys.story}/${postKey}`).set({
      title,
      dateTime: new Date(Date.now()).toLocaleString(),
      content,
      hashTags
    })
    return stories
  }
}

export const withDB = (WrappedComponent) => {
  const db = new DbManager()
  return <WrappedComponent {...{...this.props, db}} />
}
