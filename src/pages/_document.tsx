import { Html, Head, Main, NextScript } from 'next/document'



export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Eorguessr - Find the location in the universe of FFXIV"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>
        <script src="https://kit.fontawesome.com/44560cd5e0.js" crossOrigin="anonymous"></script>
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
