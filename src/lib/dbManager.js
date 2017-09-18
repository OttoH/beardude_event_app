import firebase from 'firebase'
import { fireBaseConfig } from './consts'

/**
 * DBManager
 * @class DbManager
 * @param
 * @constructor
 */
export class DBManager {
  constructor () {
    if (!window._dbInstance) {
      try {
        firebase.initializeApp(fireBaseConfig)
      } catch (err) {
        if (!/already exists/.test(err.message)) {
          console.error('Firebase initialization error', err.stack)
        }
      }
      window._dbInstance = firebase.database()
    }
    this.db = window._dbInstance

    this.subscribes = []
  }

  async readRefData (ref) {
    if (!ref) {
      console.warn('readRefData', 'none ref!')
      return null
    }
    const snapshot = await this.db.ref(ref).once('value')
    return snapshot.val()
  }

  addRefDataListener (ref, cb) {
    if (ref) {
      const refListener = this.db.ref(ref)
      refListener.on('value', (snapshot) => {
        cb(snapshot.val())
      })
      this.subscribes.push(refListener)
      console.log('ref eventListner added')
    }
  }

  removeAllRefDataListener () {
    this.subscribes.forEach((V, I) => {
      V.off()
    })
  }
 }

export const withDB = (WrappedComponent) => {
  const db = new DBManager()
  return <WrappedComponent {...{...this.props, db}} />
}
