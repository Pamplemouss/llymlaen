import Head from 'next/head'
import { Viewer } from '@photo-sphere-viewer/core';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import GameContext from '@/components/GameContext';
const Map = dynamic(() => import("@/components/Map"), { ssr: false });


export default function Home() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [toFind, setToFind] = useState<any>(null);
    const [viewer, setViewer] = useState<Viewer | null>(null);
    var photospheres = [
        {name: "North Shroud", region: "The Black Shrouds", pos: [-34.125, 33.93], url: "limsa.jpeg"},
        {name: "South Shroud", region: "The Black Shrouds", pos: [-30.8, -28.5], url: "test.jpeg"},
        {name: "Central Shroud", region: "The Black Shrouds", pos: [-7.25, -51.25], url: "thevault.jpeg"},
    ];


    useEffect(() => {
        if (viewer == null) {
            setViewer(new Viewer({
                container: document.getElementById("viewer") as HTMLElement,
            }));
        }
    }, [])

    useEffect(() => {
        if (toFind !== null) {viewer!.setPanorama('photospheres/' + toFind.url)}
    }, [toFind])

    function startGame() {
        if (isPlaying) return;

        setIsPlaying(true);
        var newLocation;
        do {
            newLocation = photospheres[Math.floor(Math.random() * photospheres.length)]
        } while (newLocation.name == toFind?.name)
        setToFind(newLocation);
    }

    const mapVariants = {
        playing: { scale: 0.5, opacity: 0.5, transition: { duration: 0.2, delay: 0.5, type: "linear" } },
        finished: { width: "60rem", height:"50rem", opacity: 1, transition: { type: "linear" } },
        hover: { scale: 1, opacity: 1, transition: { duration: 0.2, delay:0, type: "linear" } }
    }

    const mapAnim = () => {
        if (toFind === null) return "playing";
        if (isPlaying) return "playing";
        else return "finished";
    }

    return (
        <GameContext.Provider value={{isPlaying, setIsPlaying}}>
            <Head>
                <title>FFXIV Geoguessr</title>
                <link href="https://fonts.cdnfonts.com/css/myriad-pro" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>
            </Head>
            
            <div className="flex flex-col h-screen w-screen">
                <div className="w-screen h-14 bg-slate-800 flex shadow shadow-[rgba(0,0,0,0.5)] z-30">
                    <div onClick={startGame} className={`m-auto ffxivBtn rounded-full px-8 py-1 shadow shadow-black text-yellow-100 ${!isPlaying ? "cursor-pointer" : "opacity-40"}`}>Start Game</div>
                </div>
                <div className="grow flex relative">
                    <div className={`m-auto flex w-full h-full relative z-20 ${toFind === null ? "hidden" : null}`}>
                        <div id="viewer" className="w-full h-full"></div>
                        <motion.div
                            variants={mapVariants}
                            animate={mapAnim()}
                            whileHover={isPlaying ? "hover" : ""}
                            className="p-5 absolute bottom-8 right-8 w-[30rem] h-[30rem] origin-bottom-right"
                        >
                            <div className="overflow-hidden w-full h-full shadow-[0px_0px_30px_black,0px_0px_30px_black] border-2 border-yellow-100 rounded-xl ">
                                {toFind === null ? null :
                                    <Map key={toFind.name + toFind.pos} toFind={toFind}></Map>
                                }
                            </div>
                        </motion.div>
                    </div>
                    <div className="absolute h-full w-full top-0 left-0 bg-slate-900 z-10"></div>
                </div>
            </div>
        </GameContext.Provider>
    )
}
