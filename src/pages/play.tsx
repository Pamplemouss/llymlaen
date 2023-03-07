import Head from 'next/head'
import { Viewer } from '@photo-sphere-viewer/core';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { CountUp } from 'countup.js';
import dynamic from 'next/dynamic';
import GameContext from '@/components/GameContext';
import TopBar from '@/components/TopBar';
const Map = dynamic(() => import("@/components/Map"), { ssr: false });


export default function Play() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [toFind, setToFind] = useState<any>(null);
    const [viewer, setViewer] = useState<Viewer | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [scoreHUD, setScoreHUD] = useState<number | null>(null);
    const [round, setRound] = useState<number>(0);
    const [ended, setEnded] = useState<boolean>(false);
    const totalScoreCounter = useRef<CountUp | null>();
    const gameData = useRef<any>({locations: [], scores: []});
    const x = useMotionValue(0); // score progress bar
    var photospheres = [
        {name: "North Shroud", region: "The Black Shrouds", pos: [-34.125, 33.93], url: "limsa.jpeg"},
        {name: "South Shroud", region: "The Black Shrouds", pos: [-30.8, -28.5], url: "test.jpeg"},
        {name: "Central Shroud", region: "The Black Shrouds", pos: [-7.25, -51.25], url: "thevault.jpeg"},
        {name: "Old Gridania", region: "The Black Shrouds", pos: [-30.8, -28.5], url: "north_shroud_1.jpg"},
        {name: "New Gridania", region: "The Black Shrouds", pos: [-7.25, -51.25], url: "central_shroud_1.jpg"},
    ];
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
        if (toFind !== null) {viewer!.setPanorama('photospheres/' + toFind.url)}
    }, [toFind])

    // Animate score
    useEffect(() => {
        if (score === null) return;

        gameData.current.scores.push(score);

        x.set(0);
        setScoreHUD(null);
        setTimeout(() => {
            
            animate(x, score, {
                duration: 1,
                onUpdate: latest => setScoreHUD(latest)
            });
        }, 1300)
    }, [score]);

    // Animate total score
    useEffect(() => {
        totalScoreCounter.current?.update(totalScore);
    }, [totalScore]);

    // Set new location
    useEffect(() => {
        if (round === 0) return;
        setToFind(gameData.current.locations[round-1])
    }, [round]);

    // Setup photosphere and counter when game begin
    useEffect(() => {
        if (!ended) {
            setViewer(new Viewer({
                container: document.getElementById("viewer") as HTMLElement,
                navbar: ['zoom', 'move'],
            }));
            totalScoreCounter.current = new CountUp('totalScore', 0);
        }
        else {
            totalScoreCounter.current = new CountUp('totalScore', 0, {duration: 2});
            setTimeout(() => {
                totalScoreCounter.current?.update(totalScore);
            }, (gameSystem.maxRounds*0.25 + 0.75)*1000)
        }
    }, [ended]);


    function pickLocations() {
        if (gameSystem.maxRounds > photospheres.length) throw "Max rounds number is above photospheres selection";
        for (var i = 0 ; i < gameSystem.maxRounds ; i++) {
            var newLocation;
            do {
                newLocation = photospheres[Math.floor(Math.random() * photospheres.length)]
            } while (gameData.current.locations.includes(newLocation))
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


    const container = {
        visible: {
            transition: {
                delayChildren: 0.4,
                staggerChildren: 0.25,
            }
        }
    }
        
    const item = {
        hidden: { scale: 2, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
    }

    return (
        <GameContext.Provider value={{isPlaying, setIsPlaying, setScore, distance, setDistance, gameSystem}}>
            <Head>
                <title>FFXIV Geoguessr</title>
                <link href="https://fonts.cdnfonts.com/css/myriad-pro" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>
            </Head>
            
            <div className="absolute h-full w-full flex flex-col">
                <TopBar></TopBar>

                {!ended ? (
                    <div className="flex flex-col h-full w-full relative">
                        <div className="rounded neosans absolute translate-x-3 right-0 top-20 z-30 bg-gradient-to-b from-emerald-300 to-emerald-800 shadow-lg shadow-black/50 skew-x-12">
                            <div className="flex gap-9 pl-8 pr-10 py-3 -skew-x-12 uppercase italic text-center">
                                <div className="flex flex-col">
                                    <div className="text-xs text-emerald-200 text-shadow shadow-emerald-800/40">Round</div>
                                    <div className="text-slate-100 text-xl text-shadow shadow-emerald-800/50">{round} / {gameSystem.maxRounds}</div>
                                </div>
                                <div className="flex flex-col w-10">
                                    <div className="text-xs text-emerald-200 text-shadow shadow-emerald-800/40">Score</div>
                                    <div className="text-slate-100 text-xl text-shadow shadow-emerald-800/50" id="totalScore"></div>
                                </div>
                            </div>
                        </div>

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
                                                    <motion.div initial={{ width: 100*(gameSystem.region/gameSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                                                        <div className="text-xs flex absolute -top-1 right-2 translate-x-full -translate-y-full">
                                                            <i className={`${Math.round(scoreHUD!) < gameSystem.region ? "opacity-0 -rotate-180 -translate-x-5" : "opacity-1 rotate-0 translate-x-0"} duration-700 text-yellow-200 m-auto text-xs fa fa-star`} aria-hidden="true"></i>
                                                            <span className={`${Math.round(scoreHUD!) < gameSystem.region ? "text-slate-500" : "text-yellow-200"} duration-700 ml-1`}>Region</span>
                                                        </div>
                                                    </motion.div>
                                                    <motion.div initial={{ width: 100*(gameSystem.map/gameSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                                                        <div className="text-xs flex absolute -top-1 right-2 translate-x-full -translate-y-full">
                                                            <i className={`${Math.round(scoreHUD!) < gameSystem.map ? "opacity-0 -rotate-180 -translate-x-5" : "opacity-1 rotate-0 translate-x-0"} duration-700 text-yellow-200 m-auto text-xs fa fa-star`} aria-hidden="true"></i>
                                                            <span className={`${Math.round(scoreHUD!) < gameSystem.map ? "text-slate-500" : "text-yellow-200"} duration-700 ml-1`}>Map</span>
                                                        </div>
                                                    </motion.div>
                                                    <motion.div
                                                        style={{width: 100*(scoreHUD!/gameSystem.total)+"%"}}
                                                        className={`${Math.round(scoreHUD!) < gameSystem.total ? "bg-green-400" : "bg-yellow-300 duration-500"} rounded-xl absolute h-full`}>
                                                    </motion.div>
                                                    <div className="absolute translate-x-1/2 -translate-y-full right-0 justify-center items-center flex">
                                                        <i className={`${Math.round(scoreHUD!) < gameSystem.total ? "opacity-0 scale-0" : "opacity-1 scale-1"} duration-300 text-2xl text-yellow-200 m-auto text-xs fa fa-star`} aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                {distance == null ? (
                                                    <div className="text-slate-300 font-medium text-center">Your guess was not in the correct map.</div>)
                                                : (
                                                    <div className="text-slate-300 font-medium text-center">Your guess was <span className="mx-1 font-semibold bg-slate-100/10 inline-block -skew-x-12 px-2"><span className="inline-block skew-x-12">{Math.round(distance)} units</span></span> from the correct location.</div>
                                                )}
                                                <motion.div
                                                    onClick={round === gameSystem.maxRounds ? displayResults : nextRound}
                                                    whileTap={{ y: 2 }}
                                                    className="group m-auto mt-12 ffxivBtn rounded-full inline-block cursor-pointer px-8 py-1 shadow shadow-black text-yellow-100">
                                                        <span className="duration-200 group-hover:text-shadow group-hover:shadow-amber-300/50">{ round === gameSystem.maxRounds ? "See results" : "Play next round"}</span>
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
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full relative flex flex-col gap-14 justify-center items-center">
                        <div className="absolute h-full w-full bg-gradient-to-b from-indigo-900 to-slate-900 z-[-1]">
                            <div className="absolute h-full w-full bg-slate-900 opacity-80"></div>
                        </div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="flex-wrap items-center justify-center flex flex-rows-3 gap-16 w-10/12"
                        >
                            {gameData.current.locations.map((location: any, index: number) => {
                                var bgURL = "url('/photospheres/" + location.url + "')";
                                return (
                                    <motion.div
                                        variants={item}
                                        key={location.name}
                                        className="w-3/12 relative h-52 group flex flex-col rounded-lg overflow-hidden shadow-lg shadow-black/70"
                                    >
                                        <div className="absolute h-full w-full bg-cover bg-center z-[-1] grayscale-[50%] group-hover:grayscale-0 duration-200" style={{backgroundImage: bgURL}}></div>
                                        <div className={`${gameData.current.scores[index] === 100 ? "bg-yellow-300/80 text-shadow shadow-black/50": "bg-slate-800/80 shadow-black/80"} text-center neosans text-slate-200 py-1 shadow`}>{location.name} - {location.region}</div>
                                        <div className={`neosans text-6xl grow items-center justify-center flex ${gameData.current.scores[index] === 100 ? "text-yellow-300" : "text-slate-100"} text-shadow-lg shadow-slate-900`}>{gameData.current.scores[index]}</div>
                                        <div className="h-2 w-full bg-slate-800/90">
                                            <motion.div
                                                animate={{ width: gameData.current.scores[index] + "%" }}
                                                className={`h-full bg-gradient-to-br ${gameData.current.scores[index] === 100 ? "from-yellow-200 to-yellow-400" : "from-emerald-400 to-emerald-700"}`}>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )
                            })}
 
                        </motion.div>

                        <motion.div className={`${totalScore === gameSystem.total*gameSystem.maxRounds ? "from-yellow-200 to-yellow-500" : "from-emerald-400 to-emerald-900"} bg-gradient-to-b rounded-full py-3 px-7 neosans text-3xl text-slate-100 shadow-lg shadow-black/50`}>
                            <span className="text-shadow shadow-black/50">Total score: <span className="text-right w-16 inline-block" id="totalScore"></span> / {gameSystem.maxRounds * gameSystem.total}</span>
                        </motion.div>
                        
                        <motion.div
                            onClick={restart}
                            initial={{ scale: 1, skewX: -12, opacity: 0 }}
                            animate={{ scale: 1, skewX: -12, opacity: 1 }}
                            whileHover={{ scale: [1.2, 1], transition: {duration: 0.1} }}
                            transition={{ delay: gameSystem.maxRounds*0.25 + 2.55, duration: 0.5 }}
                            className="block border-4 border-slate-100/70 -skew-x-12 group duration-100 overflow-hidden shadow-lg shadow-black/50 relative uppercase bg-gradient-to-br hover:shadow-yellow-500 hover:from-yellow-700 hover:to-yellow-400 from-gray-800/50 to-gray-700/50 cursor-pointer py-4 px-16 rounded-xl"
                        >
                            <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                                <div className="absolute top-0 left-0 group-hover:bg-white/50 bg-white/50 h-full w-1.5 rounded-xl"></div>
                            </div>
                            <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                            <div className="duration-200 absolute group-hover:opacity-100 opacity-0 top-0 group-hover:left-3/4 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10 "></div>
                            <span className="neosans text-4xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-200">Restart</span>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: [1,0] }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-0 left-0 bg-white h-full w-full">
                            </motion.div>
                        </motion.div>
                    </div>
                )}
                
            </div>
        </GameContext.Provider>
    )
}
