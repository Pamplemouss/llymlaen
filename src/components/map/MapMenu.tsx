import { useContext } from "react";
import { Map as FFMap } from '@/data/mapData'
import GameContext from "../GameContext";
import { getRegion, isRegion } from "@/Utilities";


interface Props {
    currentMap: FFMap,
    regionsMenuOpen: boolean,
    zonesMenuOpen: boolean,
    setRegionsMenuOpen: any,
    setZonesMenuOpen: any,
    changeLocation: any,
    TheSource: FFMap,
}

export default function MapMenu({currentMap, TheSource, changeLocation, regionsMenuOpen, setRegionsMenuOpen, zonesMenuOpen, setZonesMenuOpen} : Props) {
    const gameContext = useContext(GameContext);

    return (
        <>
        <div className="z-10 pointer-events-none absolute w-9/12 -left-5 -top-2 h-20 4k:h-28 flex opacity-50 shadow-[-40px_4px_8px_#000] blur-sm">
            <div className="h-full bg-black grow"></div>
            <div className="h-full w-2/12 bg-gradient-to-r from-black to-transparent"></div>
        </div>
        <div className="absolute left-6 4k:left-12 top-2 text-yellow-50 z-20">
            <div className="relative flex">
                <div onClick={() => { if (gameContext.isPlaying) {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}}} className="dropdownMenu cursor-pointer">
                    <div className="h-5 w-5 4k:w-7 4k:h-7 select-none text-gray-300 text-base 4k:text-xl font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center">
                        <span className={`${regionsMenuOpen ? "rotate-90" : ""}`}>&#62;</span>
                    </div>
                    <div className="ml-2 text-sm 4k:text-2xl text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{getRegion(currentMap)?.name}</span></div>
                </div>
                {regionsMenuOpen && (
                    <div className="absolute z-20 px-1 py-2 4k:px-3 4k:py-3 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600">
                        {TheSource.markers.map((marker) => {
                            return (
                                <div onClick={() => {changeLocation(marker.target) }} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm 4k:text-2xl" key={marker.target.name}>{marker.target.name}</div>
                            )
                        })}
                    </div>
                )}
            </div>
            <div className="relative flex mt-3">
                <div onClick={() => { if (gameContext.isPlaying) {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}}} className={`${currentMap.name !== "The Source" ? "cursor-pointer" : null} dropdownMenu`}>
                    <div className="overflow-hidden relative h-5 w-5 4k:w-7 4k:h-7 select-none text-gray-300 text-base 4k:text-xl font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center">
                        <span className={`${zonesMenuOpen && currentMap.name !== "The Source" ? "rotate-90" : ""}`}>&#62;</span>
                        <div className={`${currentMap.name !== "The Source" ? "hidden" : null} h-full w-full z-10 absolute top-0 left-0 bg-slate-900/80`}></div>
                    </div>
                    <div className={`ml-2 text-sm 4k:text-2xl text-shadow shadow-amber-300/50 inline-flex justify-center items-center`}><span>{isRegion(currentMap) ? "--" : (currentMap.name === "The Source" ? "" : currentMap.name)}</span></div>
                </div>
                {zonesMenuOpen && getRegion(currentMap) !== undefined ? (
                    <div className="absolute z-20 px-1 py-2 4k:px-3 4k:py-3 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600">
                        {getRegion(currentMap).markers.map((zone) => {
                            if (getRegion(currentMap) === getRegion(zone.target)) {
                            return (
                                <div onClick={() => {changeLocation(zone.target) }} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm 4k:text-2xl" key={zone.target.name}>{zone.target.name}</div>
                            )}
                        })}
                    </div>
                ) : null}
            </div>
        </div>
        </>
    )
}

