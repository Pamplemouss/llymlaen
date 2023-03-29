import Head from 'next/head'
import TopBar from '@/components/TopBar';

export default function Info() {
    var infoContent = (
        <span className="text-slate-300 text-lg font-myriad">
            Hi, I&apos;m <span className="text-emerald-400">Pamplemouss</span> and I&apos;m a french developer. I like to make music and video games. As a fan of Final Fantasy XIV, it was a matter of time until I created something around it. So here it is, Eorguessr!
            
            <div className="flex items-center gap-3 text-base text-yellow-200 bg-slate-700 p-2 shadow shadow-black/50 rounded mt-5">
                <img className="inline-block" src="/info/gil.png"></img>
                <span>Here is my <a className="duration-200 px-1 text-yellow-400 text-shadow shadow-yellow-900 hover:shadow-yellow-600 hover:underline" rel="noreferrer" href="https://ko-fi.com/pamplemouss" target="_blank">Ko-fi</a> if you have any extra gils to spend! It would be really appreciated.</span>
            </div>
            <div className="items-center xl:items-stretch flex-col xl:flex-row flex gap-6 my-5 justify-evenly">
                <a href="https://na.finalfantasyxiv.com/lodestone/character/18356659/" target="_blank" rel="noreferrer" className="hover:bg-slate-600 duration-200 shadow shadow-black/50 py-1 px-3 rounded text-sm gap-2 bg-slate-700 flex items-center">
                    <img src="/info/arrLogo.png" className="bg-clip-text w-6 h-6"></img>
                    <div className="flex flex-col">
                        <span>Decumana Grandis</span>
                        <span className="text-xs text-slate-400">Chaos - Omega</span>
                    </div>
                </a>
                <a href="https://discordapp.com/users/123133020034170889" target="_blank" rel="noreferrer" className="hover:bg-slate-600 duration-200 cursor-pointer shadow shadow-black/50 py-1 px-3 rounded text-sm gap-2 bg-slate-700 flex items-center">
                    <i className="fa-brands fa-discord mr-2"></i>
                    <span>Pamplemouss#7301</span>
                </a>
            </div>
            <div className="text-sm text-slate-400 border-l-4 pl-4 border-slate-400 mt-10">
                <span>Special thanks to:</span>
                <br></br>- Barathesh, for his tutorial on creating photospheres
                <br></br>- SamHourai, being the first one to create a Geoguessr for FFXIV
                <br></br>- Saffron, Damian Gray and Spensers for beta-testing
            </div>
        </span>
    )
    return (
        <>
            <Head>
                <title>Eorguessr</title>
                <link key="favApple" rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"></link>
                <link key="fav32" rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"></link>
                <link key="fav16" rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"></link>
                <link key="manifest" rel="manifest" href="/favicon/site.webmanifest"></link>
                <link key="favSafari" rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"></link>
            </Head>

            <div className="xl:absolute h-full w-full flex flex-col bg-slate-800">
                <TopBar></TopBar>
                { 0 ? (
                    <div className="relative h-full w-full flex flex-col justify-center items-center overflow-hidden align-middle">
                        <div>
                            <video src="/info/aboutme16-9-1080.webm" autoPlay muted loop></video>
                        </div>
                        <div className="absolute top-0 left-0 bg-gradient-to-br from-slate-900/30 to-slate-600/30 w-full h-full"></div>

                        <div className="py-6 px-8 mt-14 ml-24 flex rounded-lg max-w-xl absolute top-0 left-0 border-2 border-x-[#c0a270] border-y-[#e0c290] bg-gradient-to-br from-slate-800 to-slate-700 shadow-md shadow-black/90">
                            {infoContent}
                        </div>
                    </div>
                )

                : (
                    <div className="relative h-full w-full flex flex-col xl:justify-center items-center xl:overflow-hidden">
                        <div className="hidden xl:block absolute top-0 left-0 h-full w-full grayscale-[0.25]">
                            <video src="/info/sharlayan.webm" autoPlay muted loop></video>
                        </div>
                        <div className="fixed top-0 left-0 h-full w-full bg-slate-800 xl:bg-slate-800/40"></div>
                        
                        
                        <div className="pt-8 xl:pt-0 mt-32 w-11/12 xl:w-auto h-full xl:h-auto -translate-y-10 gap-2 flex-col items-center xl:flex-row flex rounded-xl xl:overflow-hidden relative border-2 border-x-[#c0a270] border-y-[#e0c290] bg-gradient-to-br from-slate-800 to-slate-700 shadow-md shadow-black/90">
                            <div className="aspect-square w-8/12 rounded xl:rounded-none overflow-hidden xl:w-[25rem] shadow shadow-black">
                                <video src="/info/aboutme1-1-1080b.webm" autoPlay muted loop></video>
                            </div>
                            <div className="xl:max-w-2xl p-6">
                                <div className="">
                                    {infoContent}
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }
                
            </div>
        </>
    )
}
