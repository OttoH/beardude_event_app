import React from 'react'
import BaseComponent from '../BaseComponent'
import { actionCreators } from '../../ducks/account'
import { Redirect } from 'react-router-dom'
import Footer from '../Footer'
import Button from '../Button'
import css from './style.css'

class Account extends BaseComponent {
  constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch

    this.state = {
      email: '',
      password: ''
    }

    this._bind('handleSubmit', 'handleInput')
  }
  handleInput (field) {
    return (e) => {
      const state = {...this.state}
      state[field] = e.currentTarget.value
      this.setState(state)
    }
  }
  handleSubmit () {
    const { email, password } = this.state
    if (email && password) {
      this.dispatch(actionCreators.login(email, password))
    }
  }
  render () {
    const { email, password } = this.state
    const { isAuthenticated, error, isAccountLoading } = this.props.account
    const { from } = this.props.location.state || { from: { pathname: '/console' } }
    const err = error ? '' : <div className={css.errMsg}>{error.message}</div>

    if (!isAccountLoading && isAuthenticated) {
      return <Redirect to={from} />
    }

    return (<div className={css.wrap}>
      <div className={css.heading}>
        <h1 className={css.bdlogo}>
          <span className={css.logoB}>Beardude</span>
          <span className={css.logoE}>Event</span>
        </h1>
      </div>
      <div className={css.mainBody}>
        <div className={css.body}>
          { !isAccountLoading
            ? <div>
              {err}
              <form>
                <ul>
                  <li className={css.li}>
                    <input type='text' className={css.text1} value={email} onChange={this.handleInput('email')} placeholder='電子信箱' />
                  </li>
                  <li className={css.li}>
                    <input type='password' className={css.text2} value={password} onChange={this.handleInput('password')} placeholder='密碼' />
                  </li>
                </ul>
              </form>
              <div className={css.ft}>
                <Button onClick={this.handleSubmit} text='登入' />
              </div>
            </div>
          : <div className={css.loading}>Loading...</div> }
        </div>
      </div>
      <Footer />
    </div>)
  }
}

export default Account
