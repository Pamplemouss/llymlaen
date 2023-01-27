import Head from 'next/head'
import { Viewer } from '@photo-sphere-viewer/core';
import { useEffect } from 'react';
import dynamic from 'next/dynamic'
const Map = dynamic(() => import("../components/Map"), { ssr: false });


export default function Home() {
    var viewer : Viewer;
    useEffect(() => {
        if (viewer == null) {
            viewer = new Viewer({
                container: document.getElementById("viewer") as HTMLElement,
                panorama: 'limsa.jpeg',
            });
        }
    })

    return (
        <>
            <Head>
                <title>FFXIV Geoguessr</title>
                <link href="https://fonts.cdnfonts.com/css/myriad-pro" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>
            </Head>
        
            <div className="w-screen h-screen flex">
                <div className="m-auto flex w-full h-full relative">
                    <div id="viewer" className="w-full h-full"></div>
                    <div className=" p-5 absolute bottom-12 right-12 w-[30rem] h-[30rem] scale-[0.65] hover:scale-100 focus:scale-100 origin-bottom-right opacity-50 hover:opacity-100 duration-200">
                        <div className="overflow-hidden w-full h-full shadow-[0px_0px_30px_black,0px_0px_30px_black] border-2 border-yellow-100 rounded-xl ">
                            <Map></Map>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
