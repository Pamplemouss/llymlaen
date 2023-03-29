import Head from 'next/head'
import { Viewer } from '@photo-sphere-viewer/core';
import { useEffect, useRef, useState } from 'react';
import TopBar from '@/components/TopBar';
import { UserAgent } from '@quentin-sommer/react-useragent';


export default function Play() {
    const [viewer, setViewer] = useState<Viewer | null>(null);
    const isEdge = useRef<boolean>(false);

    // Setup photosphere
    useEffect(() => {
        setViewer(new Viewer({
            container: document.getElementById("viewer") as HTMLElement,
            navbar: [],
            defaultZoomLvl: 0,
            maxFov: 80,
        }));

        
    }, []);

    useEffect(() => {
        var format;
        if (isEdge.current) format = "jpg"
        else format = "avif"

        viewer?.setPanorama('photospheres/1.' + format)
        
    }, [viewer])

    function Edge() {
        
    }

    function CheckEdge () {
        return (
            <UserAgent returnFullParser>
                {(parser : any) => {
                    isEdge.current = parser.getBrowser().name === "Edge"
                }}
            </UserAgent>
        )
    }

    return (
        <>
        <Head>
            <title>Eorguessr</title>
            <link key="favApple" rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"></link>
            <link key="fav32" rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"></link>
            <link key="fav16" rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"></link>
            <link key="manifest" rel="manifest" href="/favicon/site.webmanifest"></link>
            <link key="favSafari" rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"></link>
        </Head>

        <CheckEdge/>
        
        <div className="absolute h-full w-full flex flex-col overflow-hidden">
            <TopBar></TopBar>

            <div id="viewer" className="w-full h-full"></div>
            
        </div>
        </>
            
    )
}
