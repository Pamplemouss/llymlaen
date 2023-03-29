import { useMapEvents } from "react-leaflet";
import { Map as FFMap } from '@/data/mapData'
import { motion, useAnimation } from "framer-motion";
import GameContext from "@/components/GameContext";
import { useContext } from "react";

/* import '@geoman-io/leaflet-geoman-free';  
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';   */

interface Props {
    currentMap: FFMap,
    TheSource: FFMap,
    guessPos: [number, number] | null,
    guess: any,
}

export default function GuessButton({currentMap, TheSource, guessPos, guess} : Props) {
    const gameContext = useContext(GameContext);
    const guessControls = useAnimation();
    
    function guessTooltip() {
        if (currentMap === TheSource) return "Pick a region";
        if (!currentMap.hasOwnProperty("region")) return "Pick a zone";
        if (guessPos === null) return "Place your pin on the map";
        return "Guess"
    }
    
    useMapEvents({
        click(e) {
            if (currentMap.hasOwnProperty("region")) return;
            if (!(e.originalEvent.target as HTMLElement).classList.contains("leaflet-container")) return;
            guessControls.set({ opacity: 0.3 })
            guessControls.start({ opacity: 0 })
        },
    });

    return gameContext.isPlaying ? (
        <div onClick={() => guess()} className={`${guessPos == null ? "opacity-70" : "cursor-pointer"} guessBtn p-1.5 w-full group absolute bottom-0 right-0 z-10`}>
            <div className={`border relative overflow-hidden ${guessPos === null ? "disabled border-x-zinc-600 border-y-zinc-500 text-zinc-300" : "border-x-[#c0a270] border-y-[#e0c290] text-yellow-100"} text-sm 4k:text-2xl py-1.5 4k:py-3 tracking-wide px-8 font-semibold shadow-md shadow-[rgba(0,0,0,0.75)] rounded-full text-center ffxivBtn`}>
                <span>{guessTooltip()}</span>
                <motion.div animate={guessControls} className="absolute top-0 left-0 w-full h-full bg-white opacity-0"></motion.div>
            </div>
        </div>
    ) : null
}

