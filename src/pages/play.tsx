import Head from 'next/head'
import { Viewer } from '@photo-sphere-viewer/core';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import GameContext from '@/components/GameContext';
const Map = dynamic(() => import("@/components/Map"), { ssr: false });


export default function Home() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [toFind, setToFind] = useState<any>(null);
    const [viewer, setViewer] = useState<Viewer | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const x = useMotionValue(0); // score progress bar
    const [scoreHUD, setScoreHUD] = useState<number | null>(null);
    var photospheres = [
        {name: "North Shroud", region: "The Black Shrouds", pos: [-34.125, 33.93], url: "limsa.jpeg"},
        {name: "South Shroud", region: "The Black Shrouds", pos: [-30.8, -28.5], url: "test.jpeg"},
        {name: "Central Shroud", region: "The Black Shrouds", pos: [-7.25, -51.25], url: "thevault.jpeg"},
    ];
    const scoreSystem = {
        region: 10,
        map: 20,
        dist: 70,
        total: 100,
        distMax: 110,
    }


    useEffect(() => {
        if (viewer == null) {
            setViewer(new Viewer({
                container: document.getElementById("viewer") as HTMLElement,
                navbar: ['zoom', 'move'],
            }));
        }

        startGame();
    }, [])

    useEffect(() => {
        if (toFind !== null) {viewer!.setPanorama('photospheres/' + toFind.url)}
    }, [toFind])

    useEffect(() => {
        if (score === null) return;
        setTimeout(() => {
            animate(x, score, {
                duration: 1,
                onUpdate: latest => setScoreHUD(latest)
            });
        }, 1300)
    }, [score]);



    function startGame() {
        if (isPlaying) return;

        x.set(0);
        setDistance(null);
        setScore(null);
        setScoreHUD(null)
        setIsPlaying(true);
        
        var newLocation;
        do {
            newLocation = photospheres[Math.floor(Math.random() * photospheres.length)]
        } while (newLocation.name == toFind?.name)
        setToFind(newLocation);
    }

    const mapVariants = {
        idle: { scale: 0.5, opacity: 0.5, transition: { duration: 0.2, delay: 0.5, type: "linear" } },
        hover: { scale: 1, opacity: 1, transition: { duration: 0.2, delay:0, type: "linear" } }
    }


    return (
        <GameContext.Provider value={{isPlaying, setIsPlaying, setScore, distance, setDistance, scoreSystem}}>
            <Head>
                <title>FFXIV Geoguessr</title>
                <link href="https://fonts.cdnfonts.com/css/myriad-pro" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>
            </Head>
            
            <div className="flex flex-col h-screen w-screen">
                <div className="grow flex relative">
                    <div className={`m-auto flex w-full h-full relative z-20 ${toFind === null ? "hidden" : null}`}>
                        {/* PHOTOSPHERE */}
                        <div id="viewer" className="w-full h-full"></div>

                        <div className="h-[30rem] absolute bottom-16 right-8 flex">
                            {/* RESULTS */}
                            <AnimatePresence>
                            { !isPlaying ? (
                                <motion.div
                                    initial={{ x: 700, opacity: 0 }}
                                    animate={{ x: "-30rem", opacity: 1 }}
                                    exit={{ x: 700, opacity: 0, transition: {delay: 0, duration: 1} }}
                                    transition={{  duration: 0.3, delay: 0.7 }}
                                    className="w-[33rem] pt-6 pb-8 m-auto mr-8 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col rounded-xl border-2 border-yellow-100 shadow-[0px_0px_30px_black,0px_0px_30px_black]">
                                    <div className="w-9/12 m-auto flex flex-col">
                                        <div className="text-yellow-200 italic font-bold text-center text-xl m-auto text-shadow shadow-amber-300/50">{Math.round(scoreHUD!)} points</div>
                                        <div className=" h-2 mt-12 mb-6 bg-slate-600 rounded-full flex relative">
                                            <motion.div initial={{ width: 100*(scoreSystem.region/scoreSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                                                <div className="text-xs flex absolute -top-1 right-2 translate-x-full -translate-y-full">
                                                    <i className={`${Math.round(scoreHUD!) < scoreSystem.region ? "opacity-0 -rotate-180 -translate-x-5" : "opacity-1 rotate-0 translate-x-0"} duration-700 text-yellow-200 m-auto text-xs fa fa-star`} aria-hidden="true"></i>
                                                    <span className={`${Math.round(scoreHUD!) < scoreSystem.region ? "text-slate-500" : "text-yellow-200"} duration-700 ml-1`}>Region</span>
                                                </div>
                                            </motion.div>
                                            <motion.div initial={{ width: 100*(scoreSystem.map/scoreSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                                                <div className="text-xs flex absolute -top-1 right-2 translate-x-full -translate-y-full">
                                                    <i className={`${Math.round(scoreHUD!) < scoreSystem.map ? "opacity-0 -rotate-180 -translate-x-5" : "opacity-1 rotate-0 translate-x-0"} duration-700 text-yellow-200 m-auto text-xs fa fa-star`} aria-hidden="true"></i>
                                                    <span className={`${Math.round(scoreHUD!) < scoreSystem.map ? "text-slate-500" : "text-yellow-200"} duration-700 ml-1`}>Map</span>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                style={{width: 100*(scoreHUD!/scoreSystem.total)+"%"}}
                                                className={`${Math.round(scoreHUD!) < scoreSystem.total ? "bg-green-400" : "bg-yellow-300 duration-500"} rounded-xl absolute h-full`}>
                                            </motion.div>
                                            <div className="absolute translate-x-1/2 -translate-y-full right-0 justify-center items-center flex">
                                                <i className={`${Math.round(scoreHUD!) < scoreSystem.total ? "opacity-0 scale-0" : "opacity-1 scale-1"} duration-300 text-2xl text-yellow-200 m-auto text-xs fa fa-star`} aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        {distance == null ? (
                                            <div className="text-slate-300 font-medium text-center">Your guess was not in the correct map.</div>)
                                        : (
                                            <div className="text-slate-300 font-medium text-center">Your guess was <span className="mx-1 font-semibold bg-slate-100/10 inline-block -skew-x-12 px-2"><span className="inline-block skew-x-12">{Math.round(distance)} units</span></span> from the correct location.</div>
                                        )}
                                        <motion.div
                                            onClick={startGame}
                                            whileTap={{ y: 2 }}
                                            className="group m-auto mt-12 ffxivBtn rounded-full inline-block cursor-pointer px-8 py-1 shadow shadow-black text-yellow-100">
                                                <span className="duration-200 group-hover:text-shadow group-hover:shadow-amber-300/50">Play next round</span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ) : null }
                            </AnimatePresence>
                            
                            {/* MAP */}
                            <motion.div
                                variants={mapVariants}
                                animate={toFind === null || isPlaying ? "idle" : "hover"}
                                whileHover={"hover"}
                                className="absolute bottom-0 right-0 w-[30rem] h-[30rem] origin-bottom-right overflow-hidden w-full h-full shadow-[0px_0px_30px_black,0px_0px_30px_black] border-2 border-yellow-100 rounded-xl">
                                {toFind === null ? null :
                                    <Map key={toFind.name + toFind.pos} toFind={toFind} ></Map>
                                }
                            </motion.div>
                        </div>
                    </div>
                    <div className="absolute h-full w-full top-0 left-0 bg-slate-900 z-10"></div>
                </div>
            </div>
        </GameContext.Provider>
    )
}
