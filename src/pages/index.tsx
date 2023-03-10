import Head from 'next/head'
import Link from 'next/link';
import { motion } from "framer-motion";
import { useState } from 'react';
import TopBar from '@/components/TopBar';

export default function Home() {
    const [expansions, setExpansions] = useState<string[] | null>(["arealmreborn"]);

    function Expansion({expansion}: {expansion: any}) {
        function expClick(expansion : string) {
            if (!expansions?.includes(expansion)) setExpansions([...expansions!, expansion]);
            else {
                expansions.splice(expansions.indexOf(expansion), 1);
                setExpansions([...expansions!]);
            }
            
        };

        return (
            <motion.div
                onClick={()=> expClick(expansion)}
                initial={{ scale: 1, skewX: -12 }}
                whileHover={{ scale: [1.1, 1] }}
                whileTap={{ scale: [1.2, 1] }}
                transition={{ duration: 0.1 }}
                className={`vignette ${expansion} ${expansions?.includes(expansion) ? "active" : null} border-4 w-3/12 h-44 border-slate-100/70 -skew-x-12 group duration-100 overflow-hidden shadow-lg shadow-black/50 relative cursor-pointer py-4 px-16 rounded-xl`}
            >
                <div className={`bg mix-blend-color-dodge absolute top-0 left-0 h-full w-full opacity-20 z-10`}></div>
                <div className={`duration-100 bgImage ${expansion}-bg skew-x-12 absolute top-0 -left-4 h-full w-[110%]`}></div>
                <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                    <div className={`left-bar absolute top-0 left-0 bg-white/50 h-full w-1.5 rounded-xl`}></div>
                </div>
                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                <div className="reflect duration-200 absolute group-hover:opacity-100 opacity-0 top-0 group-hover:left-3/4 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10 "></div>
                <span className="neosans text-4xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-200"></span>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileTap={{ opacity: [1, 0] }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 bg-white/40 h-full w-full z-10">
                </motion.div>
            </motion.div>
        )
    }

    return (
        <>
            <Head>
                <title>FFXIV Geoguessr</title>
                <link key="favApple" rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"></link>
                <link key="fav32" rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"></link>
                <link key="fav16" rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"></link>
                <link key="manifest" rel="manifest" href="/favicon/site.webmanifest"></link>
                <link key="favSafari" rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"></link>
            </Head>

            <div className="absolute h-full w-full flex flex-col">
                <TopBar></TopBar>

                <div className="relative h-full w-full flex flex-col justify-center items-center">
                    <div className="absolute top-0 left-0 h-full w-full home-background grayscale"></div>
                    <div className="absolute top-0 left-0 h-full w-full bg-slate-800/90"></div>

                    <div className="flex-wrap justify-center flex flex-flow-col flex-rows-3 gap-10 w-10/12">
                        <Expansion expansion="arealmreborn"></Expansion>
                        <Expansion expansion="heavensward"></Expansion>
                        <Expansion expansion="stormblood"></Expansion>
                        <Expansion expansion="shadowbringer"></Expansion>
                        <Expansion expansion="endwalker"></Expansion>
                    </div>

                    <Link href="play">
                        <motion.div
                            initial={{ scale: 1, skewX: -12 }}
                            whileHover={{ scale: [1.2, 1] }}
                            transition={{ duration: 0.1 }}
                            className="block border-4 border-slate-100/70 mt-20 -skew-x-12 group duration-100 overflow-hidden shadow-lg shadow-black/50 relative uppercase bg-gradient-to-br hover:shadow-yellow-500 hover:from-yellow-700 hover:to-yellow-400 from-gray-800/50 to-gray-700/50 cursor-pointer py-4 px-16 rounded-xl"
                        >
                            <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                                <div className="absolute top-0 left-0 group-hover:bg-white/50 bg-white/50 h-full w-1.5 rounded-xl"></div>
                            </div>
                            <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                            <div className="duration-200 absolute group-hover:opacity-100 opacity-0 top-0 group-hover:left-3/4 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10 "></div>
                            <span className="neosans text-4xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-200">Play</span>
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
        </>
    )
}
