import Link from 'next/link';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export default function TopBar() {
    const [cookiesConsent, setCookiesConsent] = useState<boolean>(true);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [cookies, setCookie] = useCookies(['cookiesPolicy']);
    
    function decisionCookies(accept: boolean) {
        if (accept) {
            setCookie('cookiesPolicy', "all", {sameSite: 'strict'})
            setCookiesConsent(true)
            gtag('consent', 'update', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
            });
        }
        else {
            setCookie('cookiesPolicy', "necessary", {sameSite: 'strict'})
            setCookiesConsent(true)
        }

        setOpenPopup(false)
    }

    useEffect(() => {
        window.addEventListener('mouseup', (e) => {
            if ((e?.target as HTMLElement).closest(".popup") === null) setOpenPopup(false);
        })
    }, [])

    return (
        <div className="popup fixed top-0 left-0 pl-5 pr-6 flex justify-between h-16 4k:h-24 w-full bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg shadow-black/50 items-center z-50">
            <Link href="/" className="h-full flex justify-center items-center">
                <div className="h-[85%] aspect-square relative">
                    <Image alt="logo" fill src="/logo.png" sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw" className="object-contain"></Image>
                </div>
                <div className="text-xl 4k:text-2xl text-emerald-400 font-neosans tracking-wider flex justify-center items-center ml-5">EORGUESSR</div>
            </Link>

            <div className="relative">
                <div onClick={() => setOpenPopup(!openPopup)} className="p-2 text-slate-400 hover:text-emerald-400 duration-100 cursor-pointer text-2xl text-shadow-lg shadow-black/30 hover:shadow-emerald-200/10">
                    <i className="fa-sharp fa-solid fa-cookie-bite"></i>
                </div>

                { openPopup && (
                    <div
                        className="md:translate-y-full md:-translate-x-full fixed md:absolute top-20 md:top-0 bottom-0 left-0 origin-top-right w-screen md:w-max"
                    >
                        <div className="md:w-auto md:max-w-xl z-50 overflow-hidden p-6 bg-[rgb(50,50,50)] rounded shadow-[0_0_1px_2px_rgba(0,0,0,0.6)]">
                            <div className="absolute top-0 left-0 h-4 w-full bg-gradient-to-b from-white opacity-30"></div>
                            <div className="flex gap-4">
                                <div className="relative rounded-lg shadow-[-1px_1px_3px_2px_rgba(0,0,0,.7)] overflow-hidden h-16 aspect-square">
                                    <img className="object-cover" src="/cookie.webp"></img>
                                    <div className="absolute rounded-lg top-0 left-0 w-full h-full border-t-2 border-slate-100/80 "></div>
                                </div>
                                <div className="text-[rgb(215,215,215)] text-2xl font-meiryo text-shadow-lg shadow-black/70 flex items-center"><span className="origin-left scale-x-[95%]">Cookies</span></div>
                            </div>

                            <div className="w-full mt-5 mb-2 h-[5px] bg-[rgb(40,40,40)] rounded-full border-b-2 border-b-[rgb(80,80,80)] border-t border-t-[rgb(20,20,20)]"></div>
                            
                            <div className="text-[rgb(205,205,205)] tracking-wide font-bold font-meiryo text-shadow-ff shadow-black/80 antialiased leading-5">
                                This website is using:
                                <br/>- Necessary cookies to function properly
                                <br/>- Google Analytics cookies to keep track of traffic
                                <br/><br/>We do not collect any personal data.

                                <div className="text-sky-400 mt-4">Current setting: {cookies.cookiesPolicy === "all" ? "All cookies" : "Only necessary"}</div>
                            </div>

                            <div className="w-full mt-5 mb-2 h-[5px] bg-[rgb(40,40,40)] rounded-full border-b-2 border-b-[rgb(80,80,80)] border-t border-t-[rgb(20,20,20)]"></div>
                            <div className="mt-4 flex flex-col md:flex-row gap-4 justify-evenly">
                                <span onClick={() => decisionCookies(true)} className="text-center text-yellow-200 cursor-pointer py-1 px-8 ffxivBtn rounded-full shadow shadow-black font-myriad">Accept all cookies</span>
                                <span onClick={() => decisionCookies(false)} className="text-center text-yellow-200 cursor-pointer py-1 px-8 ffxivBtn rounded-full shadow shadow-black font-myriad">Necessary cookies only</span>
                            </div>
                            
                        </div>
                    </div>
                )}
                
            </div>

        </div>
    )
}