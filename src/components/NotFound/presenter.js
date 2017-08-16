import React from 'react'
import css from './style.css'
import Header from '../Header'
import Footer from '../Footer'

const NotFound = ({location}) => <div className={css.wrap}><Header location={location} /><div className={css.mainBody}>Not Found</div><Footer /></div>
export default NotFound
