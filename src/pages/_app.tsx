import '@/styles/globals.css'
import React from 'react'
import App from 'next/app'
import {UserAgentProvider} from '@quentin-sommer/react-useragent'
import Script from 'next/script'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;


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
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {cookie_flags: 'SameSite=None;Secure'});
          `}
        </Script>
        <Component {...pageProps} />
      </>
      
    )
  }
}

export default PageWrapper(MyApp)