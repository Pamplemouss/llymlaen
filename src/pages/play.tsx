import Head from 'next/head'
import { Viewer } from '@photo-sphere-viewer/core';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import GameContext from '@/components/GameContext';
import TopBar from '@/components/TopBar';
import Results from '@/components/Results';
import RoundResults from '@/components/RoundResults';
import RoundStrip from '@/components/RoundStrip';
import MapData from '../data/mapData'
import Photospheres from '../data/locationsData'
const Map = dynamic(() => import("@/components/Map"), { ssr: false });


export default function Play() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [toFind, setToFind] = useState<any>(null);
    const [viewer, setViewer] = useState<Viewer | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [round, setRound] = useState<number>(0);
    const [ended, setEnded] = useState<boolean>(false);
    const gameData = useRef<any>({locations: [], scores: []});
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
        startGame();
    }, [])

    // Set photosphere picture
    useEffect(() => {
        if (toFind !== null) {viewer!.setPanorama('Photospheres/' + toFind.url)}
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
                navbar: ['zoom', 'move'],
                defaultZoomLvl: 0,
                maxFov: 80,
            }));
        }
    }, [ended]);


    function getMap(name: string) {
        var map;
        MapData.forEach(region => {
            region.markersZone.forEach(zone => {
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

    const mapVariants = {
        idle: { scale: 0.5, opacity: 0.5, transition: { duration: 0.2, delay: 0.5, type: "linear" } },
        hover: { scale: 1, opacity: 1, transition: { duration: 0.2, delay:0, type: "linear" } }
    }

    return (
        <GameContext.Provider value={{isPlaying, setIsPlaying, round, score, setScore, totalScore, distance, setDistance, gameSystem, gameData, displayResults, restart, nextRound, ended}}>
            <Head>
                <title>FFXIV Geoguessr</title>
                <link key="favApple" rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"></link>
                <link key="fav32" rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"></link>
                <link key="fav16" rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"></link>
                <link key="manifest" rel="manifest" href="/favicon/site.webmanifest"></link>
                <link key="favSafari" rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"></link>
            </Head>
            
            <div className="absolute h-full w-full flex flex-col">
                <TopBar></TopBar>

                {!ended ? (
                    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-900 to-slate-800 relative">
                        <RoundStrip></RoundStrip>

                        <div className="grow flex relative">
                            <div className={`m-auto flex w-full h-full relative z-20 ${toFind === null ? "hidden" : null}`}>
                                {/* PHOTOSPHERE */}
                                <div id="viewer" className="w-full h-full"></div>

                                <div className="h-[30rem] absolute bottom-16 right-8 flex">
                                    {/* RESULTS */}
                                    <AnimatePresence>
                                    { !isPlaying ? (
                                        <RoundResults></RoundResults>
                                    ) : null }
                                    </AnimatePresence>
                                    
                                    {/* MAP */}
                                    <motion.div
                                        variants={mapVariants}
                                        animate={toFind === null || isPlaying ? "idle" : "hover"}
                                        whileHover={"hover"}
                                        className="absolute bottom-0 right-0 w-[30rem] h-[30rem] origin-bottom-right overflow-hidden w-full h-full shadow-[0px_0px_30px_black,0px_0px_30px_black] border-2 border-yellow-100 rounded-xl">
                                        {toFind === null ? null :
                                            <Map key={toFind.map.name + toFind.pos} toFind={toFind} ></Map>
                                        }
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Results></Results>
                )}
                
            </div>
        </GameContext.Provider>
    )
}
