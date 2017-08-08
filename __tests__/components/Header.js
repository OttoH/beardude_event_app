/* global jest, beforeAll, describe, it, expect */
import React from 'react'
import { mount } from 'enzyme'
import * as routerDependency from 'react-router-dom'

import Header from '../../src/components/Header/presenter'

const accountMock = {
  credentials: {
    email: 'email@',
    error: '',
    password: 'pwd'
  },
  isAuthenticated: 1,
  manager: {
    email: 'email@',
    firstName: 'Azai',
    id: 1,
    isActive: true
  }
}

describe('/components/Header', () => {
  beforeAll(() => {
    routerDependency.Link = jest.fn(() => null)
    routerDependency.Redirect = jest.fn(() => null)
    routerDependency.NavLink = jest.fn(() => null)
  })

  it('should render account info', () => {
    const wrapper = mount(<Header {...{account: accountMock}} />)
    expect(wrapper.find('a.style__accountLink___2vCne').text()).toEqual('email@')
  })

  it('should show account menu when click account link', () => {
    const wrapper = mount(<Header {...{account: accountMock}} />)
    wrapper.find('.style__accountLink___2vCne').simulate('click')
    expect(wrapper.find('.style__accountMenu___1K59L > li').length).toEqual(2)
  })

  it('should redirect if authenticated fail', () => {
    mount(<Header {...{account: {...accountMock, isAuthenticated: 0}}} />)
    expect(routerDependency.Redirect).toHaveBeenCalled()
  })

  it('should render nav with base', () => {
    const wrapper = mount(<Header {...{account: accountMock, nav: 'base'}} />)
    // NavLink can not be found by enzyme lib or we can read content
    expect(wrapper.find('.style__navContainer___3QHTC li').length).toEqual(4)
  })

  it('should render nav with event', () => {
    const wrapper = mount(<Header {...{account: accountMock, nav: 'event', match: {params: {id: 6}}}} />)
    // NavLink can not be found by enzyme lib or we can read content
    expect(wrapper.find('.style__navContainer___3QHTC li').length).toEqual(2)
  })

  it('should handle logout', () => {
    const dispatch = jest.fn()
    jest.spyOn(Header.prototype, 'handleLogout')
    const wrapper = mount(<Header {...{account: accountMock, nav: 'base', dispatch}} />)
    wrapper.find('.style__accountLink___2vCne').simulate('click')
    wrapper.find('.style__accountMenu___1K59L .style__aMenuItem___3lZ8n').simulate('click')
    expect(dispatch).toHaveBeenCalled()
  })

  it('handleToggleAccountMenu should change state', () => {
    jest.spyOn(Header.prototype, 'handleToggleAccountMenu')
    const wrapper = mount(<Header {...{account: accountMock}} />)
    wrapper.find('.style__accountLink___2vCne').simulate('click')
    expect(wrapper.state().showAccountMenu).toEqual(true)
  })
})
