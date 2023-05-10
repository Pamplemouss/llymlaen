import { animate, motion, useMotionValue } from "framer-motion";
import { UserAgent } from '@quentin-sommer/react-useragent'
import { useContext, useEffect, useState } from "react";
import GameContext from "../GameContext";
import ScoreTooltip from "./ScoreTooltip";


export default function RoundResults() {
    const gameContext = useContext(GameContext);
    const [scoreHUD, setScoreHUD] = useState<number | null>(null);
    const x = useMotionValue(0);

    const modalD = 0.4;
    const progressBarT = 1;
    const progressBarD = 0.3 + modalD;
    const textD = gameContext.score === 0 ? 0.5 : progressBarT + progressBarD + 0.2;
    const UITimings = {
        modal: modalD,
        progressBar: progressBarD,
        progressBarDuration: progressBarT,
        text: textD,
    }
    
    useEffect(() => {
        if (gameContext.score === null) return;

        x.set(0);
        setScoreHUD(null);
        setTimeout(() => {
            animate(x, gameContext.score, {
                duration: UITimings.progressBarDuration,
                onUpdate: latest => setScoreHUD(latest)
            });
        }, UITimings.progressBar * 1000)
    }, [gameContext.score]);


    return (
        <UserAgent returnFullParser>
        {(parser : any) => {
            var isMobile = parser.getDevice().type == "mobile";
            var x = isMobile ? "10px" : "-100%";
        
            return (
                <motion.div
                    initial={{ x: x, y: isMobile ? 0 : "-50%", opacity: 0, scale: isMobile ? 1.2 : 2 }}
                    animate={{ x: x, y: isMobile ? 0 : "-50%", opacity: 1, scale: 1 }}
                    exit={{ x: x, y: isMobile ? 0 : "-50%", opacity: 0, scale: 0, transition: {delay: 0, duration: 0.3} }}
                    transition={{  duration: 0.3, delay: UITimings.modal }}
                    className={`${isMobile ? "top-20 left-0 w-[calc(100vw-20px)] fixed" : "-left-4 top-1/2 w-[25rem] xl:w-[40rem] 4k:w-[60rem] absolute"} z-40 pointer-events-auto pb-4 lg:pb-8 m-auto flex flex-col rounded-xl shadow-[0px_0px_30px_black,0px_0px_30px_black]`}>
                    
                    <ScoreTooltip isMobile={isMobile}></ScoreTooltip>

                    {/* BACKGROUND */}
                    <div className="h-full w-full top-0 left-0 absolute overflow-hidden rounded-xl">
                        <div className="absolute h-full w-full bg-gradient-to-b from-indigo-900 to-slate-900 z-[-1]">
                            <div className="absolute h-full w-full bg-slate-900 opacity-80"></div>
                        </div>
                    </div>

                    <div className={`score ${Math.round(scoreHUD!) < gameContext.gameSystem.total ? "bg-cyan-400" : "bg-gradient-to-br from-yellow-300 to-yellow-200" } relative rounded-t-xl py-2 lg:py-5 w-full text-slate-100 text-center text-3xl xl:text-5xl m-auto font-neosans italic`}>
                        <span>+{Math.round(scoreHUD!)}</span>
                        { Math.round(scoreHUD!) == gameContext.gameSystem.total && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [1,0] }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-0 left-0 bg-white h-full w-full">
                            </motion.div>
                        )}
                    </div>
                    
                    <div className="w-10/12 m-auto flex flex-col">
                        <div className={`flex justify-center gap-5 text-xl lg:text-3xl 4k:text-4xl ${isMobile ? "mt-2" : "mt-8"}`}>
                            <div className="relative">
                                <i className="text-shadow-lg shadow-black/20 text-slate-600 fa fa-star" aria-hidden="true"></i>
                                { Math.round(scoreHUD!) >= gameContext.gameSystem.region && (
                                    <motion.i
                                        initial={{ color: "#fff" }}
                                        animate={{ color: "rgb(254 240 138)", scale: [1.8, 1] }}
                                        transition={{ duration: 0.25 }}
                                        className="fa fa-star absolute top-1 left-0 text-shadow-lg shadow-yellow-300/50" aria-hidden="true">
                                    </motion.i>
                                ) }
                            </div>
                            <div className="relative">
                                <i className="text-shadow-lg shadow-black/20 text-slate-600 fa fa-star" aria-hidden="true"></i>
                                { Math.round(scoreHUD!) >= gameContext.gameSystem.map && (
                                    <motion.i
                                        initial={{ color: "#fff" }}
                                        animate={{ color: "rgb(254 240 138)", scale: [1.8, 1] }}
                                        transition={{ duration: 0.25 }}
                                        className="fa fa-star absolute top-1 left-0 text-shadow-lg shadow-yellow-300/50" aria-hidden="true">
                                    </motion.i>
                                ) }
                            </div>
                            <div className="relative">
                                <i className="text-shadow-lg shadow-black/20 text-slate-600 fa fa-star absolute top-1/2 -translate-y-1/2" aria-hidden="true"></i>
                                { Math.round(scoreHUD!) >= gameContext.gameSystem.total && (
                                    <motion.i
                                        initial={{ color: "#fff" }}
                                        animate={{ color: "rgb(254 240 138)", scale: [1.8, 1] }}
                                        transition={{ duration: 0.25 }}
                                        className="fa fa-star absolute top-1 left-0 text-shadow-lg shadow-yellow-300/50" aria-hidden="true">
                                    </motion.i>
                                ) }
                            </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="h-2 4k:h-4 mt-2 lg:mt-5 mb-4 4k:mb-8 bg-slate-600 rounded-full flex relative -skew-x-12">
                            <motion.div initial={{ width: 100*(gameContext.gameSystem.region/gameContext.gameSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                            </motion.div>
                            <motion.div initial={{ width: 100*(gameContext.gameSystem.map/gameContext.gameSystem.total)+"%" }} className="z-10 border-r-2 border-slate-800 relative">
                            </motion.div>
                            <motion.div
                                style={{width: 100*(scoreHUD!/gameContext.gameSystem.total)+"%"}}
                                className={`${Math.round(scoreHUD!) < gameContext.gameSystem.total ? "from-cyan-400 via-cyan-200 to-cyan-400" : "from-amber-400 via-yellow-200 to-amber-400"} bg-gradient-to-l absolute h-full rounded-l-full`}>
                            </motion.div>
                            { Math.round(scoreHUD!) == gameContext.gameSystem.total && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [1,0] }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute top-0 left-0 bg-white shadow-[0px_0px_6px_5px_white] h-full w-full rounded-full">
                                </motion.div>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1}}
                            transition={{ delay: UITimings.text }}
                            className="text-slate-100 text-center font-neosans font-normal text-sm xl:text-base 4k:text-2xl"
                        >
                            {gameContext.score <= gameContext.gameSystem.region && gameContext.score !== null ?
                                <span>Your guess was not in the correct map.</span>
                            : gameContext.score === gameContext.gameSystem.total ? 
                                <span>You found the exact location!</span>
                            : gameContext.distance === null ?
                                <span>Your guess was not in the correct sub area.</span>
                            :
                                <span>Your guess was <span className="mx-1 bg-slate-100/20 inline-block -skew-x-12 px-3 py-0.5 rounded"><span className="inline-block skew-x-12">{Math.round(gameContext.distance)} yalms</span></span> from the correct location.</span>
                            }
                        </motion.div>

                        <div className={`flex justify-center ${isMobile ? "mt-4" : "mt-8 lg:mt-12"}`}>
                            <motion.div
                                initial={{ scale: 1, skewX: -12 }}
                                whileHover={{ scale: [1.1, 1] }}
                                onClick={gameContext.round === gameContext.gameSystem.maxRounds ? gameContext.displayResults : gameContext.nextRound}
                                className={`bg-slate-600 group flex hover:bg-cyan-400 text-slate-100 text-shadow shadow-black/40 rounded inline-block shadow-lg shadow-black/50 relative uppercase cursor-pointer py-2 overflow-hidden flex justify-center items-center`}
                            >
                                <span className="ml-6 skew-x-12 translate-x-[20px] group-hover:translate-x-0 duration-200 font-neosans text-sm lg:text-lg 4k:text-3xl tracking-wide italic inline-block">{ gameContext.round === gameContext.gameSystem.maxRounds ? "Results" : "Next round"}</span>
                                <div className="px-5 flex justify-center items-center text-xl skew-x-12">
                                    <motion.span animate={{ x: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <i className="-translate-x-[20px] group-hover:translate-x-[0px] duration-200 opacity-0 group-hover:opacity-100 fa-solid fa-arrow-right-long"></i>
                                    </motion.span>
                                    
                                </div>
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
        }}
        </UserAgent>
        
    )
}