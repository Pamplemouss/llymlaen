import '@/styles/globals.css'
import React from 'react'
import App from 'next/app'
import {UserAgentProvider} from '@quentin-sommer/react-useragent'


/* eslint-disable react/display-name */
const PageWrapper = (Comp : any) =>
  class extends React.Component {
    /*
     * Need to use args.ctx
     * See https://nextjs.org/docs/advanced-features/custom-document
     */
    static async getInitialProps(args : any) {
      return {
        ua: args.ctx.req
          ? args.ctx.req.headers['user-agent']
          : navigator.userAgent,
        ...(Comp.getInitialProps ? await Comp.getInitialProps(args) : null),
      }
    }

    render() {
      const {ua, ...props} = this.props
      return (
        <UserAgentProvider ua={ua}>
          <Comp {...props} />
        </UserAgentProvider>
      )
    }
}

class MyApp extends App {
  render() {
    const {Component, pageProps} = this.props
    return (
      <Component {...pageProps} />
    )
  }
}

export default PageWrapper(MyApp)