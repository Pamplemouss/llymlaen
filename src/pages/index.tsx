import Head from 'next/head'
import Link from 'next/link';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { expansionsValid } from '@/components/CookiesManager';


export default function Home() {
    const [cookies, setCookie] = useCookies(['expansions']);
    const [expansions, setExpansions] = useState<string[]>();
    
    useEffect(() => {
        setCookie('expansions', expansions, {sameSite: 'strict'})
    }, [expansions])

    useEffect(() => {
        setExpansions(expansionsValid(cookies.expansions) ? cookies.expansions : ["ARR"]);
    }, [])

    function expClick(expansion : string) {
        if (!expansions?.includes(expansion)) setExpansions([...expansions!, expansion]);
        else {
            expansions.splice(expansions.indexOf(expansion), 1);
            setExpansions([...expansions!]);
        }
    };


    return (
        <>
            <div className="relative md:absolute h-full w-full flex flex-col">

                <div className="relative h-full w-full flex flex-col md:justify-center items-center pt-24 xl:pt-8">
                    <div className="fixed top-0 left-0 h-full w-full home-background grayscale"></div>
                    <div className="fixed top-0 left-0 h-full w-full bg-slate-800/90"></div>

                    <div className="border-2 border-x-[#c0a270] border-y-[#e0c290] w-11/12 md:w-10/12 4k:w-8/12 bg-gradient-to-br from-slate-800 to-slate-700 relative px-6 py-4 text-slate-300 font-myriad text-lg 4k:text-3xl shadow-lg shadow-black/50 rounded-lg mb-16">
                        Welcome Warrior of <span className="text-shadow shadow-yellow-200/20 text-yellow-200">Light</span>! How much time did you spend in Eorzea? You will be dropped at random places in the <span className="text-emerald-400">critically acclaimed Final Fantasy XIV Online MMORPG</span>, and will have to guess where you are. Select the expansions you want to play with, click &quot;Play&quot; and have fun! 
                        <br></br>
                        <div className="text-sky-400 mt-4">For now, only A Realm Reborn, Heavensward and Stormblood are available. I expect to release Shadowbringer at the end of April.</div>
                    </div>

                    <div className="flex-wrap justify-center w-full flex md:flex-flow-col md:flex-rows-3 gap-10 md:w-10/12 4k:w-8/12 4k:gap-16">
                        {["ARR", "HW", "SB", "ShB", "EW"].map(expansion => {
                            var disabled = expansion === "EW";
                            var tap = disabled ? { } : { scale: [1.2, 1] };
                            var hover = disabled ? {} : { y: -4 };
                            var transition = disabled ? { duration: 0.5 } : { duration: 0.1 }
                            return (
                                <motion.div
                                    key={expansion}
                                    onClick={()=> disabled ? null : expClick(expansion)}
                                    initial={{ scale: 1, skewX: -12 }}
                                    whileHover={hover}
                                    whileTap={tap}
                                    transition={transition}
                                    className={`vignette ${expansion} ${expansions?.includes(expansion) ? "active shadow-[0px_0px_20px_8px_rgb(0,0,0)] border-4 4k:border-8" : null} ${disabled ? "disabled opacity-50 cursor-not-allowed backdrop-blur-xl" : "cursor-pointer backdrop-blur-sm"} w-9/12 h-32 4k:h-60 md:w-3/12 md:h-44 -skew-x-12 group overflow-hidden shadow-lg shadow-black/50 relative py-4 px-16 rounded-xl`}
                                >
                                    <div className={`bg mix-blend-color-dodge absolute top-0 left-0 h-full w-full opacity-20 z-10`}></div>
                                    <div className={`duration-100 bgImage ${expansion}-bg skew-x-12 absolute top-0 -left-4 h-full w-[110%]`}></div>
                                    <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                                        <div className={`left-bar absolute top-0 left-0 ${disabled ? "bg-slate-800" : "bg-white/50"} h-full w-1.5 4k:w-2 rounded-xl`}></div>
                                    </div>
                                    <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                                    <div className={`reflect duration-200 absolute opacity-0 top-0 ${ disabled ? "" : "group-hover:left-3/4 group-hover:opacity-100"} left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10`}></div>
                                    <span className="font-neosans text-4xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-200"></span>
                                    
                                    {disabled ? (
                                        <motion.div  className="active:text-red-500 absolute top-0 left-0 w-full h-full flex justify-center items-center text-slate-400 text-8xl z-20 opacity-70">
                                            <i className="text-shadow-lg shadow-black fa-solid fa-ban"></i>
                                        </motion.div>
                                    ) : null}
                                    
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileTap={{ opacity: disabled ? 0 : [1, 0] }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-0 left-0 bg-white/50 h-full w-full z-10">
                                    </motion.div>
                                </motion.div>
                            )
                        })}
                    </div>

                    <div className="mt-16 mb-10 md:mb-0">
                        <div className={`${expansions?.length === 0 ? null : "invisible"} translate-x-2 text-center text-red-500 text-shadow shadow-red-900 uppercase -skew-x-12 mb-3 font-myriad`}>Select at least 1 expansion!</div>
                        <Link href="play">
                            <motion.div
                                initial={{ scale: 1, skewX: -12 }}
                                whileHover={{ scale: [1.2, 1] }}
                                transition={{ duration: 0.1 }}
                                className={`${expansions?.length === 0 ? "pointer-events-none opacity-30" : " hover:shadow-yellow-500 hover:from-yellow-700 hover:to-yellow-400"} text-slate-200 border-slate-100/70  block border-4 4k:border-8 -skew-x-12 group duration-100 shadow-lg shadow-black/50 relative uppercase bg-gradient-to-br from-gray-800/50 to-gray-700/50 cursor-pointer py-4 px-16 rounded-xl`}
                            >
                                <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                                    <div className="absolute top-0 left-0 group-hover:bg-white/50 bg-white/50 h-full w-1.5 4k:w-2 rounded-xl"></div>
                                </div>
                                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                                <div className="duration-200 absolute group-hover:opacity-100 opacity-0 top-0 group-hover:left-3/4 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10 "></div>
                                <span className="font-neosans text-4xl 4k:text-6xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12">Play</span>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: [1,0] }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-0 left-0 bg-white h-full w-full">
                                </motion.div>
                            </motion.div>
                        </Link>
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
