import { CountUp } from "countup.js";
import { UserAgent } from '@quentin-sommer/react-useragent'
import { useContext, useEffect, useRef } from "react";
import GameContext from "../GameContext";


export default function RoundStrip() {
    const gameContext = useContext(GameContext);
    const totalScoreCounter = useRef<CountUp | null>();

    useEffect(() => {
        if (!gameContext.ended) {
            totalScoreCounter.current = new CountUp('totalScore', 0);
        }
    }, [gameContext.ended]);

    // Animate total score
    useEffect(() => {
        totalScoreCounter.current?.update(gameContext.totalScore);
    }, [gameContext.totalScore]);
    
    return (
        <UserAgent returnFullParser>
        {(parser : any) => {
            var isMobile = parser.getDevice().type == "mobile";
        
            return (
                <div className={`${isMobile ? "top-24": "top-40"} rounded font-neosans absolute translate-x-3 right-0 z-30 bg-gradient-to-b from-cyan-400 to-cyan-700 shadow-lg shadow-black/50 skew-x-12`}>
                    <div className="flex gap-9 pl-8 pr-10 py-3 4k:pl-14 4k:pr-16 4k:py-5 -skew-x-12 uppercase italic text-center">
                        <div className="flex flex-col">
                            <div className="text-xs 4k:text-xl text-cyan-200 text-shadow shadow-cyan-800/40">Round</div>
                            <div className="text-slate-100 text-xl 4k:text-3xl text-shadow shadow-cyan-800/50">{gameContext.round} / {gameContext.gameSystem.maxRounds}</div>
                        </div>
                        { !isMobile ? (
                            <div className="flex flex-col w-10">
                                <div className="text-xs 4k:text-xl text-cyan-200 text-shadow shadow-cyan-800/40">Score</div>
                                <div className="text-slate-100 text-xl 4k:text-3xl text-shadow shadow-cyan-800/50" id="totalScore"></div>
                            </div>
                        ) : null}
                        
                    </div>
                </div>
            )
        }}
        </UserAgent>
    )
}