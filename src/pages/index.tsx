import Link from 'next/link';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { expansionsValid, mapCategoriesValid } from '@/components/CookiesManager';


export default function Home() {
    const [cookies, setCookie] = useCookies(['expansions', "mapCategories"]);
    const [expansions, setExpansions] = useState<string[]>();
    const [mapCategories, setMapCategories] = useState<string[]>();

    useEffect(() => {
        setCookie('expansions', expansions, {sameSite: 'strict'})
    }, [expansions])

    useEffect(() => {
        setCookie('mapCategories', mapCategories, {sameSite: 'strict'})
    }, [mapCategories])

    useEffect(() => {
        setExpansions(expansionsValid(cookies.expansions) ? cookies.expansions : ["ARR"]);
        setMapCategories(mapCategoriesValid(cookies.mapCategories) ? cookies.mapCategories : ["World Maps"]);
    }, [])

    function expClick(expansion : string) {
        if (!expansions?.includes(expansion)) setExpansions([...expansions!, expansion]);
        else {
            expansions.splice(expansions.indexOf(expansion), 1);
            setExpansions([...expansions!]);
        }
    };

    function mapCatClick(category : string) {
        if (!mapCategories?.includes(category)) setMapCategories([...mapCategories!, category]);
        else {
            mapCategories.splice(mapCategories.indexOf(category), 1);
            setMapCategories([...mapCategories!]);
        }
    };

    const element = expansions?.length === 1 && cookies.expansions[0] === "ShB" ?
    (<span className="text-shadow shadow-violet-500/40 text-violet-400">Darkness</span>)
    : (<span className="text-shadow shadow-yellow-200/20 text-yellow-200">Light</span>)
    


    return (
        <>
            <div className="relative md:absolute h-full w-full flex flex-col">

                <div className="relative h-full w-full flex flex-col items-center pt-24">
                    <div className="fixed top-0 left-0 h-full w-full home-background grayscale"></div>
                    <div className="fixed top-0 left-0 h-full w-full bg-slate-800/90"></div>

                    <div className="border-2 border-x-[#c0a270] border-y-[#e0c290] w-11/12 md:w-10/12 4k:w-8/12 bg-gradient-to-br from-slate-800 to-slate-700 relative p-2 md:px-6 md:py-2 text-slate-300 font-myriad text-sm xl:text-base 4k:text-2xl shadow-lg shadow-black/50 rounded-lg mb-8 xl:mb-8">
                        <div className="text-center">Welcome Warrior of {element} !</div>
                        How much time did you spend in Eorzea? You will be dropped at random places in the <span className="text-emerald-400">critically acclaimed Final Fantasy XIV Online MMORPG</span>, and will have to guess where you are. Select the maps and expansions you want to play with, click &quot;Play&quot; and have fun! 
                    </div>


                    <div className="flex flex-col justify-center items-center h-[calc(100%-160px)] w-11/12 bg-slate-800/20 backdrop-blur border-2 border-x-[#c0a270] border-y-[#e0c290] rounded-lg">
                        <div className="mt-8 md:mt-0 flex mb-16 md:gap-10 text-sm md:text-xl select-none font-neosans uppercase w-full justify-evenly md:justify-center">
                            <motion.div
                                onClick={() => mapCatClick("World Maps")}
                                initial={{ scale: 1, skewX: -12 }}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: [1.2, 1] }}
                                transition={{ duration: 0.1 }}
                                className={`${mapCategories?.includes("World Maps") ? "bg-cyan-400 text-slate-200" : "text-zinc-500 hover:text-slate-200 bg-zinc-800 opacity-80 backdrop-blur"} overflow-hidden rounded-lg px-2 py-2 md:pl-5 md:pr-4 md:py-3 shadow-lg shadow-black/50 cursor-pointer flex gap-8 items-center`}>
                                    <span className="text-shadow shadow-black/50">World Maps</span>
                                    <div className={`${mapCategories?.includes("World Maps") ? "" : "grayscale"} aspect-square w-6 md:w-8`}>
                                        <img className="h-full w-full" src="map_icon.webp"></img>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileTap={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-0 left-0 bg-white/50 h-full w-full z-10">
                                    </motion.div>
                            </motion.div>
                            <motion.div
                                onClick={() => mapCatClick("Dungeons")}
                                initial={{ scale: 1, skewX: -12 }}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: [1.2, 1] }}
                                transition={{ duration: 0.1 }}
                                className={`${mapCategories?.includes("Dungeons") ? "bg-cyan-400 text-slate-200" : "text-zinc-500 hover:text-slate-200 bg-zinc-800 opacity-80 backdrop-blur"} overflow-hidden rounded-lg px-2 py-2 md:pl-5 md:pr-4 md:py-3 shadow-lg shadow-black/50 cursor-pointer flex gap-8 items-center`}>
                                    <span className="text-shadow shadow-black/50">Dungeons</span>
                                    <div className={`${mapCategories?.includes("Dungeons") ? "" : "grayscale"} aspect-square w-6 md:w-8`}>
                                        <img className="h-full w-full" src="dungeon_icon.webp"></img>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileTap={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-0 left-0 bg-white/50 h-full w-full z-10">
                                    </motion.div>
                            </motion.div>
                        </div>
                        
                        
                        <div className="flex-wrap justify-center w-full flex md:flex-flow-col md:flex-rows-3 gap-10 md:w-10/12 4k:w-8/12 4k:gap-16">
                            {["ARR", "HW", "SB", "ShB", "EW"].map(expansion => {
                                return (
                                    <motion.div
                                        key={expansion}
                                        onClick={() => expClick(expansion)}
                                        initial={{ scale: 1, skewX: -12 }}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: [1.2, 1] }}
                                        transition={{ duration: 0.1 }}
                                        className={`vignette ${expansion} ${expansions?.includes(expansion) ? "active shadow-[0px_0px_10px_4px_rgb(0,0,0)] border-4 4k:border-8" : null} cursor-pointer w-9/12 h-28 md:h-21 md:w-3/12 xl:h-36 group overflow-hidden shadow-lg shadow-black/50 relative py-4 px-16 rounded-xl`}
                                    >
                                        <div className={`bg mix-blend-color-dodge absolute top-0 left-0 h-full w-full opacity-20 z-10`}></div>
                                        <div className={`duration-100 bgImage ${expansion}-bg skew-x-12 absolute top-0 -left-4 h-full w-[110%]`}></div>
                                        <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                                            <div className={`left-bar absolute top-0 left-0 bg-white/50 h-full w-1.5 4k:w-2 rounded-xl`}></div>
                                        </div>
                                        <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                                        <div className={`reflect duration-200 absolute opacity-0 top-0 group-hover:left-3/4 group-hover:opacity-100 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10`}></div>
                                        <span className="font-neosans text-4xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-200"></span>
                                        
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileTap={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-0 left-0 bg-white/50 h-full w-full z-10">
                                        </motion.div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="mt-8 md:mt-4 xl:mt-16 mb-10 md:mb-0">
                            <div className={`${expansions?.length === 0 || mapCategories?.length === 0 ? "text-red-500 shadow-red-900" : "opacity-0"} translate-x-2 text-center text-shadow uppercase -skew-x-12 mb-3 font-myriad`}>
                                Select at least 1 {mapCategories?.length === 0 ? "category" : expansions?.length === 0 ? "expansion" : ""}!
                            </div>
                            <Link href="play" className={`${expansions?.length === 0 || mapCategories?.length === 0 ? "pointer-events-none" : ""}`}>
                                <motion.div
                                    initial={{ scale: 1, skewX: -12 }}
                                    whileHover={{ scale: [1.2, 1] }}
                                    transition={{ duration: 0.1 }}
                                    className={`${expansions?.length === 0 || mapCategories?.length === 0 ? "opacity-50" : "hover:bg-cyan-400 bg-slate-600" } flex items-center text-slate-200 -skew-x-12 group duration-100 shadow-lg shadow-black/50 relative uppercase cursor-pointer py-4 px-16 rounded-lg overflow-hidden`}
                                >
                                    <div className="group-hover:-translate-x-9 translate-x-0 duration-200 font-neosans text-4xl 4k:text-6xl text-shadow shadow-black/50 tracking-wide italic inline-block skew-x-12">Play</div>
                                    <div className="opacity-0 group-hover:opacity-100 duration-100 absolute group-hover:right-8 right-4 translate-x-1/2 text-shadow shadow-black/50">
                                        <i className="text-8xl fa-solid fa-circle-play"></i>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: [1,0] }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-0 left-0 bg-white h-full w-full">
                                    </motion.div>
                                </motion.div>
                            </Link>
                        </div>
                    </div>

                    
                    <motion.div
                        initial={{ y: "100%"}}
                        animate={{ y: "100%", transition: {delay: 1} }}
                        whileHover={{ y: "20%", transition: {delay: 0} }}
                        className="fixed w-24 4k:w-48 bottom-10 4k:bottom-20 right-0 4k:right-8 p-3"
                    >
                        <Link href="/info">
                            <img src="/moogle.webp"></img>
                        </Link>
                    </motion.div>
                    
                    <div className="text-shadow shadow-black z-10 mb-2 md:absolute md:bottom-0 text-center w-full text-slate-400 text-sm font-myriad pointer-events-none">FINAL FANTASY XIV © 2010 - 2023 SQUARE ENIX CO., LTD. All Rights Reserved.</div>
                </div>
            </div>            
        </>
    )
}
