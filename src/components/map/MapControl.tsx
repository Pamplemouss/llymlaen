import L from "leaflet";
import { MutableRefObject, useState } from "react";
import { lerp, invLerp } from '@/Utilities';
import Universe, { Map as FFMap, Zone } from '@/data/universe'


interface Props {
    currentMap: FFMap,
    map: MutableRefObject<L.Map | null>,
    changeLocation: any,
}

export default function MapControl({currentMap, map, changeLocation} : Props) {
    function backOneLevel() {
        if (currentMap.hasOwnProperty("region")) changeLocation((currentMap as Zone).region);
        else {
            var inTheFirst = false;
            Universe.TheFirst.markers.forEach(marker => {
                if (marker.target.name === currentMap.name) inTheFirst = true;
            })
            changeLocation(inTheFirst ? Universe.TheFirst : Universe.TheSource)
        }
    }

    function Slider() {
        const [value, setValue] = useState(invLerp(map.current?.getMinZoom()!, map.current?.getMaxZoom()!, map.current?.getZoom()!) * 100); 

        const handleOnChange = (event: any) => {
          setValue(event.target.value)
          map.current?.setZoom(lerp(map.current?.getMinZoom(), map.current?.getMaxZoom(), event.target.value/100), {animate: false})
        };

        map.current?.on('zoom', function() {
            setValue(invLerp(map.current?.getMinZoom()!, map.current?.getMaxZoom()!, map.current?.getZoom()!) * 100)
        });
        
        return (
            <input
                type="range" min="0" max="100" value={value} onChange={handleOnChange}
                className="zoom-slider w-24 rotate-180 origin-center accent-red-300"
            />
        );
    }    

    return (
        <div className="absolute top-0 -left-2 z-10">
            <div onClick={() => changeLocation(Universe.TheSource)} className="cursor-pointer p-0.5">
                <div className="rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                    <div className="w-3 h-2.5 4k:w-6 4k:h-4 shadow-sm shadow-yellow-200 border 4k:border-2 border-black m-auto"></div>
                </div>
            </div>
            <div onClick={() => backOneLevel()} className="cursor-pointer p-0.5">
                <div className="flex justify-center items-center rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                    <i className="text-slate-900 fa-solid fa-up-long text-shadow shadow-yellow-200/40 text-[0.8rem] 4k:text-[1.5rem]"></i>
                </div>
            </div>

            <div className="flex rotate-90 origin-top-left translate-x-6 pl-1">
                <div onClick={() => map.current?.zoomIn()} className="cursor-pointer p-0.5 -rotate-90">
                    <div className="flex justify-center items-center rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                        <i className="text-slate-900 fa-solid fa-plus text-shadow shadow-yellow-200/40 text-[1rem] 4k:text-[1.5rem]"></i>
                    </div>
                </div>
                <Slider />
                <div onClick={() => map.current?.zoomOut()} className="cursor-pointer p-0.5 -rotate-90">
                    <div className="flex justify-center items-center rounded shadow w-5 h-5 4k:w-10 4k:h-10 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                        <i className="text-slate-900 fa-solid fa-minus text-shadow shadow-yellow-200/40 text-[1rem] 4k:text-[1.5rem]"></i>
                    </div>
                </div>
            </div>
        </div> 
    )
}

