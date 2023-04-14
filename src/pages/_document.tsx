import { Html, Head, Main, NextScript } from 'next/document'



export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Eorguessr</title>
        <meta name="description" content="Eorguessr - Find the location in the universe of FFXIV"/>
        <link key="favApple" rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"></link>
        <link key="fav32" rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"></link>
        <link key="fav16" rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"></link>
        <link key="manifest" rel="manifest" href="/favicon/site.webmanifest"></link>
        <link key="favSafari" rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"></link>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>
        <script src="https://kit.fontawesome.com/44560cd5e0.js" crossOrigin="anonymous" async></script>
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
