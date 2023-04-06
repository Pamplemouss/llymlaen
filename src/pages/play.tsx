import Head from 'next/head'
import { UserAgent } from '@quentin-sommer/react-useragent'
import { Viewer } from '@photo-sphere-viewer/core';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import GameContext from '@/components/GameContext';
import TopBar from '@/components/TopBar';
import Results from '@/components/play/Results';
import RoundResults from '@/components/play/RoundResults';
import RoundStrip from '@/components/play/RoundStrip';
import TheSource from '../data/mapData'
import Photospheres from '../data/photospheresData'
const Map = dynamic(() => import("@/components/Map"), { ssr: false });


export default function Play() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [toFind, setToFind] = useState<any>(null);
    const [viewer, setViewer] = useState<Viewer | null>(null);
    const [preloadImg, setPreloadImg] = useState<any>(null);
    const [displayMap, setDisplayMap] = useState<boolean>(false);
    const [score, setScore] = useState<number | null>(null);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [round, setRound] = useState<number>(0);
    const [ended, setEnded] = useState<boolean>(false);
    const gameData = useRef<any>({locations: [], scores: []});
    const isEdge = useRef<boolean>(false);
    const is4k = useRef(false);
    const gameSystem = {
        region: 10,
        map: 20,
        dist: 70,
        total: 100,
        distMax: 110,
        maxRounds: 5,
    }
    
    // Start up setup
    useEffect(() => {
        is4k.current = window.innerWidth >= 2000
        startGame();
    }, [])

    // Set photosphere picture and preload next one
    useEffect(() => {
        if (toFind=== null) return;

        var format : string;
        isEdge.current ? format = ".webp" : format = ".avif"

        viewer!.setPanorama('photospheres/' + toFind.id + format).then(()=> {
            if (gameData.current.locations[round] !== undefined) setPreloadImg(<img className="hidden" src={'photospheres/' + gameData.current.locations[round].id + format} alt="Preload img"></img>);
        })
    }, [toFind])

    // add score to board
    useEffect(() => {
        if (score === null) return;

        gameData.current.scores.push(score);
    }, [score]);

    // Set new location
    useEffect(() => {
        if (round === 0) return;
        setToFind(gameData.current.locations[round-1])
    }, [round]);

    // Setup photosphere
    useEffect(() => {
        if (!ended) {
            setViewer(new Viewer({
                container: document.getElementById("viewer") as HTMLElement,
                navbar: [],
                defaultZoomLvl: 0,
                maxFov: 80,
            }));
        }
    }, [ended]);


    function getMap(name: string) {
        var map;

        TheSource.markers.forEach(marker => {
            marker.target.markers.forEach(zone => {
                if (zone.target.name === name) map = zone.target;
            })
        })
        
        if (map === undefined) throw "Map name not found in MapData";
        return map;
    }

    function pickLocations() {
        if (gameSystem.maxRounds > Photospheres.length) throw "Max rounds number is above Photospheres selection";
        for (var i = 0 ; i < gameSystem.maxRounds ; i++) {
            var newLocation;
            do {
                newLocation = Photospheres[Math.floor(Math.random() * Photospheres.length)]
            } while (gameData.current.locations.includes(newLocation))

            if (typeof newLocation.map == "string") newLocation.map = getMap(newLocation.map);
            gameData.current.locations.push(newLocation);
        }
    }

    function startGame() {
        if (isPlaying) return;

        initGame();
        pickLocations();
        setRound(1);
        setIsPlaying(true);
    }

    function nextRound() {
        setTotalScore(totalScore + score!);
        setRound(round+1);
        initRound();
        setIsPlaying(true);
    }

    function initRound() {
        setDistance(null);
        setScore(null);
        setDisplayMap(false);
    }

    function initGame() {
        initRound();
        gameData.current.scores = [];
        gameData.current.locations = [];
        setTotalScore(0);
    }

    function displayResults() {
        setTotalScore(totalScore + score!);
        viewer?.destroy();
        setEnded(true);
    }

    function restart() {
        initGame();
        setEnded(false);
        startGame();
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

    const [mapLevel, setMapLevel] = useState<number>(1)

    const mapVariants = {
        idle: { scale: 0.5, opacity: 0.5, transition: { duration: 0.2, delay: 0.5, type: "linear" } },
        hover: { scale: 1, opacity: 1, transition: { duration: 0.2, delay:0, type: "linear" } }
    }

    return (
        <GameContext.Provider value={{isPlaying, setIsPlaying, round, score, setScore, totalScore, distance, setDistance, gameSystem, gameData, displayResults, restart, nextRound, ended}}>
            <Head>
                <title>Eorguessr</title>
                <link key="favApple" rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"></link>
                <link key="fav32" rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"></link>
                <link key="fav16" rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"></link>
                <link key="manifest" rel="manifest" href="/favicon/site.webmanifest"></link>
                <link key="favSafari" rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"></link>
            </Head>

            <CheckEdge/>
            
            <div className="absolute h-full w-full flex flex-col overflow-hidden select-none">
                {preloadImg}
                <TopBar></TopBar>

                {!ended ? (
                    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-900 to-slate-800 relative">
                        <RoundStrip></RoundStrip>

                        <div className="grow flex relative">
                            <div className={`m-auto flex w-full h-full relative ${toFind === null ? "hidden" : null}`}>
                                {/* PHOTOSPHERE */}
                                <div id="viewer" className="w-full h-full"></div>

                                <div className={`map ${"level" + mapLevel} ${is4k.current ? "res4k" : ""} w-full md:max-w-[55%] pointer-events-none justify-center absolute bottom-6 md:bottom-6 md:right-8 flex`}>

                                    {/* RESULTS */}
                                    <AnimatePresence>
                                    { !isPlaying ? (
                                        <RoundResults></RoundResults>
                                    ) : null }
                                    </AnimatePresence>
                                    
                                    {/* MAP */}
                                    <UserAgent computer>
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0.5 }}
                                            variants={mapVariants}
                                            animate={toFind === null || isPlaying ? "idle" : "hover"}
                                            whileHover={"hover"}
                                            className={`map ${"level" + mapLevel} ${is4k.current ? "res4k" : ""} pointer-events-auto absolute bottom-0 right-0 origin-bottom-right shadow-[0px_0px_30px_black,0px_0px_30px_black] border-2 border-x-[#c0a270] border-y-[#e0c290] rounded-b-xl rounded-tr-xl`}
                                        >
                                            <div className="hidden lg:flex absolute -top-0.5 -left-0.5 bg-slate-800/50 -translate-y-full p-2 gap-2 4k:gap-4 4k:p-4 rounded-t-lg text-sm 4k:text-3xl">
                                                <div onClick={() => setMapLevel(Math.min(mapLevel + 1, 3))} className={`${ mapLevel === 3 ? "opacity-40" : "cursor-pointer hover:bg-slate-100 hover:text-slate-600"} bg-slate-200 text-slate-800 w-6 4k:w-12 aspect-square rounded-full flex items-center justify-center -rotate-45`}>
                                                    <i className="fa-solid fa-up-long"></i>
                                                </div>
                                                <div onClick={() => setMapLevel(Math.max(mapLevel - 1, 1))} className={`${ mapLevel === 1 ? "opacity-40" : "cursor-pointer hover:bg-slate-100 hover:text-slate-600"} bg-slate-200 text-slate-800 w-6 4k:w-12 aspect-square rounded-full flex items-center justify-center rotate-[135deg]`}>
                                                    <i className="fa-solid fa-up-long"></i>
                                                </div>
                                            </div>
                                            {toFind === null ? null :
                                                <Map key={toFind.map.name + toFind.pos} toFind={toFind} isMobile={false} isEdge={isEdge} is4k={is4k} mapLevel={mapLevel}></Map>
                                            }

                                        </motion.div>
                                    </UserAgent>
                                    <UserAgent mobile>
                                        <div onClick={() => setDisplayMap(!displayMap)} className="pointer-events-auto cursor-pointer shadow-lg shadow-black/70 fixed bottom-4 right-4 p-4 bg-emerald-500 rounded-full text-4xl text-slate-200">
                                            <i className="fa-regular fa-map"></i>
                                        </div>
                                        <div className="fixed bottom-4 left-4 p-4 text-3xl text-slate-300 opacity-50">
                                            <i className="text-shadow shadow-black fa-solid fa-arrows-up-down-left-right"></i>
                                        </div>
                                        <motion.div
                                            initial= {{ y: "110%" }}
                                            animate={displayMap ? { y: 0 } : { y: "110%"}}
                                            className="fixed bottom-4 w-11/12 pointer-events-auto aspect-square origin-bottom-right overflow-hidden shadow-[0px_0px_30px_black,0px_0px_30px_black] border-2 border-x-[#c0a270] border-y-[#e0c290] rounded-xl">
                                            {toFind === null ? null :
                                                <Map key={toFind.map.name + toFind.pos} toFind={toFind} isMobile={true} isEdge={isEdge} is4k={is4k} mapLevel={1}></Map>
                                            }
                                            <div onClick={() => setDisplayMap(!displayMap)} className="z-10 cursor-pointer w-10 h-10 absolute top-2 right-2 p-2 text-slate-200 bg-slate-800 rounded-full text-2xl flex justify-center items-center shadow shadow-black/70">
                                                <i className="fa-solid fa-xmark"></i>
                                            </div>
                                        </motion.div>
                                    </UserAgent>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Results isEdge={isEdge}></Results>
                )}
                
            </div>
        </GameContext.Provider>
    )
}
