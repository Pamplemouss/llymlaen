import { animate, motion, useMotionValue } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import GameContext from "../GameContext";


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
        <div className="h-full w-full relative flex flex-col gap-4 md:gap-14 justify-center items-center">
            <div className="absolute h-full w-full bg-gradient-to-b from-indigo-900 to-slate-900 z-[-1]">
                <div className="absolute h-full w-full bg-slate-900 opacity-50"></div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="items-center justify-center grid grid-cols-2 md:flex md:flex-wrap md:flex-rows-3 gap-3 md:gap-16 w-11/12 md:w-10/12"
            >
                {gameContext.gameData.current.locations.map((location: any, index: number) => {
                    var bgURL = "url('/snapshots/" + location.id + ".webp')";
                    return (
                        <motion.div
                            variants={item}
                            key={location.map.name + location.pos}
                            className="md:w-3/12 w-full relative h-32 md:h-40 xl:h-52 group flex flex-col rounded-lg overflow-hidden shadow-lg shadow-black/70"
                        >
                            <div className="absolute h-full w-full bg-cover bg-center z-[-1] grayscale-[50%] group-hover:grayscale-0 duration-200" style={{backgroundImage: bgURL}}></div>
                            <div className={`${gameContext.gameData.current.scores[index] === 100 ? "bg-yellow-300/80 text-shadow shadow-black/50": "bg-slate-800/80 shadow-black/80"} text-xs xl:text-base text-center font-neosans text-slate-200 py-1 shadow`}>{location.subArea === undefined ? location.map.name : location.map.menuName} - {location.map.region.name}</div>
                            <div className={`score font-neosans text-4xl md:text-6xl grow items-center justify-center flex ${gameContext.gameData.current.scores[index] === 100 ? "text-yellow-300" : "text-slate-100"} italictext-shadow-lg shadow-slate-900`}>{gameContext.gameData.current.scores[index]}</div>
                            <div className="h-2 w-full bg-slate-800/90">
                                <motion.div
                                    animate={{ width: gameContext.gameData.current.scores[index] + "%" }}
                                    className={`h-full bg-gradient-to-br ${gameContext.gameData.current.scores[index] === 100 ? "from-yellow-200 to-yellow-400" : "from-cyan-400 to-cyan-700"}`}>
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                })}

            </motion.div>

            <div className="-skew-x-12 relative rounded-full py-1 px-7 shadow-black shadow font-neosans md:text-3xl text-slate-100 w-11/12 md:w-9/12 text-center">
                <div className="absolute top-0 rounded-full overflow-hidden left-0 h-full w-full bg-gradient-to-r from-slate-700 to-slate-600 z-[-1]">
                    <div style={{width: 100*(totalScoreHUD!/(gameContext.gameSystem.total * gameContext.gameSystem.maxRounds))+"%"}} className={`${Math.round(totalScoreHUD!) < gameContext.gameSystem.maxRounds * gameContext.gameSystem.total ? "bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500" : "bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 duration-500"} -skew-x-12 absolute h-full`}></div>
                </div>
                { Math.round(totalScoreHUD!) ==  gameContext.gameSystem.maxRounds * gameContext.gameSystem.total && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [1,0] }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 bg-white shadow-[0px_0px_8px_8px_white] h-full w-full rounded-full">
                    </motion.div>
                )}
                <span className="text-shadow shadow-black/50">Total score: <span className="text-right w-16 inline-block">{Math.round(totalScoreHUD!)}</span> / {gameContext.gameSystem.maxRounds * gameContext.gameSystem.total}</span>
            </div>
            

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: gameContext.gameSystem.maxRounds*0.25 + 2.55, duration: 0.5 }} className={`flex justify-center mt-4`}>
                <motion.div
                    initial={{ scale: 1, skewX: -12 }}
                    whileHover={{ scale: [1.1, 1] }}
                    onClick={gameContext.restart}
                    
                    className="bg-slate-600 group flex hover:bg-cyan-400 text-slate-100 text-shadow shadow-black/40 rounded inline-block shadow-lg shadow-black/50 relative uppercase cursor-pointer py-2 overflow-hidden flex justify-center items-center"
                >
                    <span className="ml-6 skew-x-12 translate-x-[20px] group-hover:translate-x-0 duration-200 font-neosans text-sm lg:text-2xl 4k:text-3xl tracking-wide italic inline-block">Restart</span>
                    <div className="px-5 flex justify-center items-center text-xl skew-x-12">
                        <motion.span animate={{ x: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 1 }}>
                            <i className="-translate-x-[20px] group-hover:translate-x-[0px] duration-200 opacity-0 group-hover:opacity-100 fa-solid fa-backward"></i>
                        </motion.span>
                        
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: [1,0] }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0 left-0 bg-white h-full w-full">
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}