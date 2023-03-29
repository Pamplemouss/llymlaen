import L from "leaflet";
import { MutableRefObject } from "react";
import { Map as FFMap, Zone } from '@/data/mapData'

/* import '@geoman-io/leaflet-geoman-free';  
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';   */

interface Props {
    currentMap: FFMap,
    map: MutableRefObject<L.Map | null>,
    changeLocation: any,
    TheSource: FFMap,
}

export default function MapControl({currentMap, TheSource, map, changeLocation} : Props) {
    function backOneLevel() {
        if (currentMap.hasOwnProperty("region")) changeLocation((currentMap as Zone).region);
        else changeLocation(TheSource);
    }

    return (
        <div className="absolute top-0 -left-2 z-10">
            <div onClick={() => changeLocation(TheSource)} className="cursor-pointer p-0.5">
                <div className="rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                    <div className="w-3 h-2.5 4k:w-6 4k:h-4 shadow-sm shadow-yellow-200 border 4k:border-2 border-black m-auto"></div>
                </div>
            </div>
            <div onClick={() => backOneLevel()} className="cursor-pointer p-0.5">
                <div className="flex justify-center items-center rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                    <i className="text-slate-900 fa-solid fa-up-long text-shadow shadow-yellow-200/40 text-[0.8rem] 4k:text-[1.5rem]"></i>
                </div>
            </div>
            <div onClick={() => map.current?.zoomIn()} className="cursor-pointer p-0.5">
                <div className="flex justify-center items-center rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                    <i className="text-slate-900 fa-solid fa-plus text-shadow shadow-yellow-200/40 text-[1rem] 4k:text-[1.5rem]"></i>
                </div>
            </div>
            <div onClick={() => map.current?.zoomOut()} className="cursor-pointer p-0.5">
                <div className="flex justify-center items-center rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                    <i className="text-slate-900 fa-solid fa-minus text-shadow shadow-yellow-200/40 text-[1rem] 4k:text-[1.5rem]"></i>
                </div>
            </div>
        </div> 
    )
}

