import { animate, motion, useMotionValue } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import GameContext from "./GameContext";
import ScoreTooltip from "./ScoreTooltip";


export default function RoundResults() {
    const gameContext = useContext(GameContext);
    const [scoreHUD, setScoreHUD] = useState<number | null>(null);
    const x = useMotionValue(0);
    
    useEffect(() => {
        if (gameContext.score === null) return;

        x.set(0);
        setScoreHUD(null);
        setTimeout(() => {
            animate(x, gameContext.score, {
                duration: 1,
                onUpdate: latest => setScoreHUD(latest)
            });
        }, 1300)
    }, [gameContext.score]);

    return (
        <motion.div
            initial={{ x: "-30rem", opacity: 0, scale: 2 }}
            animate={{ x: "-30rem", opacity: 1, scale: 1 }}
            exit={{ x: "-30rem", opacity: 0, scale: 0, transition: {delay: 0, duration: 0.3} }}
            transition={{  duration: 0.3, delay: 0.7 }}
            className="z-50 relative w-[20rem] lg:w-[30rem] xl:w-[45rem] py-4 lg:py-8 m-auto mr-8 flex flex-col rounded-xl border-2 border-yellow-100 shadow-[0px_0px_30px_black,0px_0px_30px_black]">
            
            <ScoreTooltip></ScoreTooltip>

            {/* BACKGROUND */}
            <div className="h-full w-full top-0 left-0 absolute overflow-hidden rounded-xl">
                <div className="absolute h-full w-full bg-gradient-to-b from-indigo-900 to-slate-900 z-[-1]">
                    <div className="absolute h-full w-full bg-slate-900 opacity-80"></div>
                </div>
            </div>

            <div className="w-10/12 m-auto flex flex-col">
                <div className="text-yellow-200 text-center text-xl lg:text-2xl xl:text-3xl m-auto neosans">{Math.round(scoreHUD!)} points</div>

                <div className="flex justify-center gap-5 text-xl lg:text-2xl mt-8">
                    <div className="relative">
                        <i className="text-shadow-lg shadow-black/20 text-slate-600 fa fa-star absolute top-1/2 -translate-y-1/2" aria-hidden="true"></i>
                        <i className={`${Math.round(scoreHUD!) < gameContext.gameSystem.region ? "opacity-0 scale-[3]" : "opacity-1 scale-[1]"} duration-300 text-yellow-200 fa fa-star`} aria-hidden="true"></i>
                    </div>
                    <div className="relative">
                        <i className="text-shadow-lg shadow-black/20 text-slate-600 fa fa-star absolute top-1/2 -translate-y-1/2" aria-hidden="true"></i>
                        <i className={`${Math.round(scoreHUD!) < gameContext.gameSystem.map ? "opacity-0 scale-[3]" : "opacity-1 scale-[1]"} duration-300 text-yellow-200 fa fa-star`} aria-hidden="true"></i>
                    </div>
                    <div className="relative">
                        <i className="text-shadow-lg shadow-black/20 text-slate-600 fa fa-star absolute top-1/2 -translate-y-1/2" aria-hidden="true"></i>
                        <i className={`${Math.round(scoreHUD!) < gameContext.gameSystem.total ? "opacity-0 scale-[3]" : "opacity-1 scale-[1]"} duration-300 text-yellow-200 fa fa-star`} aria-hidden="true"></i>
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="h-2 mt-2 mb-4 bg-slate-600 rounded-full flex relative overflow-hidden">
                    <motion.div initial={{ width: 100*(gameContext.gameSystem.region/gameContext.gameSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                    </motion.div>
                    <motion.div initial={{ width: 100*(gameContext.gameSystem.map/gameContext.gameSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                    </motion.div>
                    <motion.div
                        style={{width: 100*(scoreHUD!/gameContext.gameSystem.total)+"%"}}
                        className={`${Math.round(scoreHUD!) < gameContext.gameSystem.total ? "bg-green-400" : "bg-yellow-300 duration-500"} absolute h-full`}>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    transition={{ delay: 2.7 }}
                    className="text-slate-300 text-center neosans font-normal text-sm xl:text-base"
                >
                    {gameContext.score <= 10 && gameContext.score !== null ?
                        <span>Your guess was not in the correct map.</span>
                    : gameContext.score === gameContext.gameSystem.total ? 
                        <span>You found the exact location!</span>
                    : gameContext.distance !== null ?
                        <span>Your guess was <span className="mx-1 bg-slate-100/10 inline-block -skew-x-12 px-3 py-0.5 rounded"><span className="inline-block skew-x-12">{Math.round(gameContext.distance)} units</span></span> from the correct location.</span>
                    :
                        <span> - </span>
                    }
                </motion.div>

                <div className="flex justify-center mt-8 lg:mt-12">
                    <motion.div
                        onClick={gameContext.round === gameContext.gameSystem.maxRounds ? gameContext.displayResults : gameContext.nextRound}
                        initial={{ scale: 1, skewX: -12 }}
                        whileHover={{ scale: [1.2, 1] }}
                        transition={{ duration: 0.1 }}
                        className={`inline-block border-2 lg:border-4 border-slate-100/70 -skew-x-12 group duration-100 overflow-hidden shadow-lg shadow-black/50 relative uppercase bg-gradient-to-br ${gameContext.round === gameContext.gameSystem.maxRounds ? "hover:shadow-yellow-500 hover:from-yellow-700 hover:to-yellow-400" : "hover:shadow-blue-500 hover:from-blue-700 hover:to-blue-400"} from-gray-800/50 to-gray-700/50 cursor-pointer py-2 px-6 rounded-xl`}
                    >
                        <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                            <div className="absolute top-0 left-0 group-hover:bg-white/50 bg-white/50 h-full w-1.5 rounded-xl"></div>
                        </div>
                        <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                        <div className="duration-200 absolute group-hover:opacity-100 opacity-0 top-0 group-hover:left-3/4 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10 "></div>
                        <span className="neosans text-base lg:text-lg text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-100">{ gameContext.round === gameContext.gameSystem.maxRounds ? "Results" : "Next round"}</span>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: [1,0] }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0 left-0 bg-white h-full w-full">
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}