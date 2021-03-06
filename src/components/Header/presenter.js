import React from 'react'
import BaseComponent from '../BaseComponent'
import { NavLink, Redirect, Link } from 'react-router-dom'
import { actionCreators } from '../../ducks/account'
import css from './style.css'

const returnNavs = {
  base: () => [
    { name: '活動', url: '/console', exact: true },
    { name: '選手', url: '/console/racer' },
    { name: '隊伍', url: '/console/team' },
    { name: '管理員', url: '/console/manager' }
  ],
  event: (match) => [
    { name: '賽制', url: '/console/event/' + match.params.uniqueName },
    { name: 'RFID測試', url: '/console/eventTest/' + match.params.uniqueName },
    { name: '賽程管理', url: '/console/eventMatch/' + match.params.uniqueName }
  ]
}

const renderAccountInfo = (that) => (<div className={css.account}>
  <a className={css.accountLink} onClick={that.handleToggleAccountMenu}>{that.props.account.manager.email}</a>
  { that.state.showAccountMenu && <ul className={css.accountMenu}>
    <li><Link className={css.aMenuItem} to='/console'>後台首頁</Link></li>
    <li><Link className={css.aMenuItem} to='/'>前台首頁</Link></li>
    <li><Link className={css.aMenuItem} to='/console/manager'>帳號設定</Link></li>
    <li><a className={css.aMenuItem} href='#' onClick={that.handleLogout}>登出</a></li>
  </ul> }
</div>)

const renderNav = (navs, matchParams) => <ul className={css.navContainer}>{navs.map(nav =>
  <li key={nav.name}><NavLink activeClassName={css.navActive} className={css.nav} to={nav.url} exact={nav.exact}>{nav.name}</NavLink></li>
)}</ul>

class Header extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      showAccountMenu: false
    }
    this._bind('handleLogout', 'handleToggleAccountMenu')
  }
  handleLogout (e) {
    e.preventDefault()
    this.props.dispatch(actionCreators.logout())
  }
  handleToggleAccountMenu () {
    this.setState({showAccountMenu: !this.state.showAccountMenu})
  }
  render () {
    const { account, location, match, isPublic, nav } = this.props
    if (!isPublic && account.isAuthenticated !== undefined && !account.isAuthenticated) {
      return <Redirect to={{ pathname: '/login', state: { from: location } }} />
    }
    return (<div className={css.mainHeader}>
      <div className={css.heading}>
        <h1 className={css.bdlogo}>
          <Link to={(isPublic) ? '/' : '/console'}>
            <span className={css.logoB}>Beardude</span>
            <span className={css.logoE}>Event</span>
          </Link>
        </h1>
      </div>
      { account && account.manager && renderAccountInfo(this) }
      { nav && renderNav(returnNavs[nav](match)) }
    </div>)
  }
}

export default Header
