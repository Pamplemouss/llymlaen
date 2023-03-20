import { animate, motion, useMotionValue } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import GameContext from "./GameContext";


export default function Results() {
    const gameContext = useContext(GameContext);
    const [totalScoreHUD, setTotalScoreHUD] = useState<number | null>(null);
    const x = useMotionValue(0); 
    
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

    useEffect(() => {
        if (gameContext.ended) {
            x.set(0);
            setTotalScoreHUD(null);
            setTimeout(() => {
                animate(x, gameContext.totalScore, {
                    duration: 1,
                    onUpdate: latest => setTotalScoreHUD(latest)
                });
            }, (gameContext.gameSystem.maxRounds*0.25 + 0.75)*1000)
        }
    }, [gameContext.ended]);

    return (
        <div className="h-full w-full relative flex flex-col gap-14 justify-center items-center">
            <div className="absolute h-full w-full bg-gradient-to-b from-indigo-900 to-slate-900 z-[-1]">
                <div className="absolute h-full w-full bg-slate-900 opacity-50"></div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="flex-wrap items-center justify-center flex flex-rows-3 gap-16 w-10/12"
            >
                {gameContext.gameData.current.locations.map((location: any, index: number) => {
                    var bgURL = "url('/snapshots/" + location.url + "')";
                    return (
                        <motion.div
                            variants={item}
                            key={location.map.name + location.pos}
                            className="w-3/12 relative h-40 xl:h-52 group flex flex-col rounded-lg overflow-hidden shadow-lg shadow-black/70"
                        >
                            <div className="absolute h-full w-full bg-cover bg-center z-[-1] grayscale-[50%] group-hover:grayscale-0 duration-200" style={{backgroundImage: bgURL}}></div>
                            <div className={`${gameContext.gameData.current.scores[index] === 100 ? "bg-yellow-300/80 text-shadow shadow-black/50": "bg-slate-800/80 shadow-black/80"} text-xs xl:text-base text-center neosans text-slate-200 py-1 shadow`}>{location.map.name} - {location.map.region.name}</div>
                            <div className={`neosans text-6xl grow items-center justify-center flex ${gameContext.gameData.current.scores[index] === 100 ? "text-yellow-300" : "text-slate-100"} text-shadow-lg shadow-slate-900`}>{gameContext.gameData.current.scores[index]}</div>
                            <div className="h-2 w-full bg-slate-800/90">
                                <motion.div
                                    animate={{ width: gameContext.gameData.current.scores[index] + "%" }}
                                    className={`h-full bg-gradient-to-br ${gameContext.gameData.current.scores[index] === 100 ? "from-yellow-200 to-yellow-400" : "from-emerald-400 to-emerald-700"}`}>
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                })}

            </motion.div>

            <div className="relative overflow-hidden rounded py-1 px-7 neosans text-3xl text-slate-100 shadow-inner shadow-black/90 w-9/12 text-center">
                <div className="absolute top-0 left-0 h-full w-full bg-slate-900 z-[-1]">
                    <div style={{width: 100*(totalScoreHUD!/(gameContext.gameSystem.total * gameContext.gameSystem.maxRounds))+"%"}} className="absolute h-full bg-gradient-to-br from-emerald-800 to-emerald-500"></div>
                </div>
                <span className="text-shadow shadow-black/50">Total score: <span className="text-right w-16 inline-block">{Math.round(totalScoreHUD!)}</span> / {gameContext.gameSystem.maxRounds * gameContext.gameSystem.total}</span>
            </div>
            
            <motion.div
                onClick={gameContext.restart}
                initial={{ scale: 1, skewX: -12, opacity: 0 }}
                animate={{ scale: 1, skewX: -12, opacity: 1 }}
                whileHover={{ scale: [1.2, 1], transition: {duration: 0.1} }}
                transition={{ delay: gameContext.gameSystem.maxRounds*0.25 + 2.55, duration: 0.5 }}
                className="block border-2 xl:border-4 border-slate-100/70 -skew-x-12 group duration-100 overflow-hidden shadow-lg shadow-black/50 relative uppercase bg-gradient-to-br hover:shadow-yellow-500 hover:from-yellow-700 hover:to-yellow-400 from-gray-800/50 to-gray-700/50 cursor-pointer py-4 px-16 rounded-xl"
            >
                <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                    <div className="absolute top-0 left-0 group-hover:bg-white/50 bg-white/50 h-full w-1.5 rounded-xl"></div>
                </div>
                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                <div className="duration-200 absolute group-hover:opacity-100 opacity-0 top-0 group-hover:left-3/4 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10 "></div>
                <span className="neosans text-2xl xl:text-4xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-200">Restart</span>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: [1,0] }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 bg-white h-full w-full">
                </motion.div>
            </motion.div>
        </div>
    )
}