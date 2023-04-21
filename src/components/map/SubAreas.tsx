import { useCookies } from "react-cookie";
import { Map as FFMap } from '@/data/universe'
import Universe from '@/data/universe'

interface Props {
    currentMap: FFMap,
    changeLocation: any
}

export default function SubAreas({currentMap, changeLocation}: Props) {
    const [cookies, setCookie] = useCookies(['expansions']);

    if (Universe.isWorldMap(currentMap) && !["ShB", "EW"].some(el => cookies.expansions.includes(el))) return (null);

    return (
        <>
        {currentMap.subAreas !== undefined ? (
            <div className="absolute text-right right-1 text-slate-100 text-shadow shadow-black/80 text-sm 4k:text-xl">
                <div className="pointer-events-none absolute w-full h-full -top-2 flex opacity-50 shadow-[20px_4px_8px_#000] blur-sm">
                    <div className="h-full w-8/12 bg-gradient-to-r from-transparent to-black"></div>
                    <div className="h-full bg-black grow"></div>
                </div>
                <div className="relative mt-3 pb-4">
                    {currentMap.subAreas?.map(subArea => {
                        return (
                            <div key={subArea} onClick={() => changeLocation(Universe.getMap(subArea))} className="flex gap-2 cursor-pointer">
                                <span className="grow">{subArea}</span>
                                {currentMap.name === subArea ? (
                                    <div className="m-auto h-2 w-2 4k:h-3 4k:w-3 bg-yellow-400 rounded-full shadow-[0_0_2px_2px] shadow-yellow-500/80 border border-yellow-100/50"></div>
                                ) : (
                                    <div className="relative m-auto h-2.5 w-2.5 4k:h-3 4k:w-3 bg-slate-200/20 rounded-full shadow-slate-100/50 shadow-[0_0.5px_2px_0.5px] after:absolute after:bg-slate-100/10 after:rounded-full after:top-0.5 after:left-0.5 after:w-[4px] after:h-[4px] after:shadow-slate-100/10 after:shadow-[0_0_2px_0.5px]"></div>
                                )}
                            </div> 
                        )
                    })}
                </div>
            </div>
        ) : null}
        </>
        
    )
}

