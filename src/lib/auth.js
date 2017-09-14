import firebase from 'firebase'
import { fireBaseConfig } from './consts'

let authInstance = false

const getInstance = () => {
  if (!authInstance) {
    try {
      firebase.initializeApp(fireBaseConfig)
    } catch (err) {
      // we skip the "already exists" message which is
      // not an actual error when we're hot-reloading
      if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
      }
    }
    authInstance = firebase.auth()
  }

  return authInstance
}

export class AuthManager {
  constructor () {
    this.auth = getInstance()
  }

  getInstance () {
    if (!this.auth) {
      console.warn('AuthManager', 'please initialize AuthManager first')
      this.auth = getInstance()
    }
    return this.auth
  }

  async getCredential (email, password) {
    return this.auth.EmailAuthProvider.credential(email, password)
  }

  loginWithEmail (email, password) {
    return this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      return this.auth.signInWithEmailAndPassword(email, password)
    })
    .catch((e) => {
      console.log('login fail: ' + e.code + '-' + e.message)
    })
  }

  getAccountInfo () {
    return firebase.auth().currentUser
  }

  logout () {
    return this.auth.signOut()
  }
}

export const withAuth = (WrappedComponent) => {
  const auth = new AuthManager()
  return <WrappedComponent {...{...this.props, auth}} />
}
