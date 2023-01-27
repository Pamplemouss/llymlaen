import Control from 'react-leaflet-custom-control'
import { useState } from "react";

type MapData = {
    zones: {
        key: string
        region: string
        url: string
        markers: {
            name: string
            latLng: [number, number]
        }[]
    }[]
    regions: string[]
}


export default function MapNavControl({mapData}: {mapData: MapData}) {
    const [zonesMenuOpen, setZonesMenuOpen] = useState(false);
    const [regionsMenuOpen, setRegionsMenuOpen] = useState(false);

    return (
        <Control prepend={true} position="topleft">
            <div className="z-10 absolute w-10/12 -left-5 -top-2 h-20 flex opacity-70">
                <div className="h-full bg-slate-900 grow "></div>
                <div className="h-full w-3/12 bg-gradient-to-r from-slate-900 to-transparent"></div>
            </div>
            <div className="absolute left-12 top-2 text-yellow-50 z-20">
                <div className="relative flex">
                    <div onClick={() => {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${regionsMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                    <div onClick={() => {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{currentMap.region}</span></div>
                    {regionsMenuOpen && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-4 border-y-neutral-500 border-x-neutral-600"
                        >
                            {mapData.regions.map((region) => {
                                return (
                                    <div className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={region}>{region}</div>
                                )
                            })}
                        </motion.div>
                    )}
                </div>
                <div className="relative flex mt-3">
                    <div onClick={() => {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${zonesMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                    <div onClick={() => {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{currentMap.key}</span></div>
                    {zonesMenuOpen ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-4 border-y-neutral-500 border-x-neutral-600"
                        >
                            {mapData.zones.map((zone) => {
                                if (zone.region == currentMap.region) {
                                    return (
                                        <div onClick={() => {changeLocation(zone.key); setZonesMenuOpen(false)}} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={zone.key}>{zone.key}</div>
                                    )
                                }
                            })}
                        </motion.div>
                    ) : null}
                </div>
            </div>
        </Control>
    )

}