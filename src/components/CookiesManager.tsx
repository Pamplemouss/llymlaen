import { useCookies } from 'react-cookie';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';


export function CookieModal() {
    const [cookiesConsent, setCookiesConsent] = useState<boolean>(true);
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
    }

    useEffect(() => {
        setCookiesConsent(cookies.cookiesPolicy !== undefined)
    }, [])

    return (
        <>
        {!cookiesConsent ? (
            <>
                <div className="fixed w-full h-full bg-black/50 backdrop-blur-sm z-20"></div>
                <div className="w-11/12 md:w-auto md:max-w-lg z-50 overflow-hidden fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-6 bg-[rgb(50,50,50)] rounded shadow-[0_0_1px_2px_rgba(0,0,0,0.6)]">
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

                        <div className="text-xs mt-2 text-slate-400">You can change your preference later by clicking the cooking in the top-right corner.</div>
                    </div>

                    <div className="w-full mt-5 mb-2 h-[5px] bg-[rgb(40,40,40)] rounded-full border-b-2 border-b-[rgb(80,80,80)] border-t border-t-[rgb(20,20,20)]"></div>
                    <div className="mt-4 flex flex-col md:flex-row gap-4 justify-evenly">
                        <span onClick={() => decisionCookies(true)} className="text-center text-yellow-200 cursor-pointer py-1 px-8 ffxivBtn rounded-full shadow shadow-black font-myriad">Accept all cookies</span>
                        <span onClick={() => decisionCookies(false)} className="text-center text-yellow-200 cursor-pointer py-1 px-8 ffxivBtn rounded-full shadow shadow-black font-myriad">Necessary cookies only</span>
                    </div>
                    
                </div>
            </>
        ) : null}
        </>
    )   
}



interface Props {
    setOpenPopup: Dispatch<SetStateAction<boolean>>;
}
export function CookiePopup({ setOpenPopup }: Props) {
    const [cookiesConsent, setCookiesConsent] = useState<boolean>(true);
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

    return (
        <div
            className="md:translate-y-full md:-translate-x-full fixed md:absolute top-20 md:top-0 bottom-0 left-0 origin-top-right w-screen md:w-max"
        >
            <div className="md:w-auto md:max-w-xl z-50 overflow-hidden p-6 bg-[rgb(50,50,50)] rounded relative shadow-[0_0_1px_2px_rgba(0,0,0,0.6)]">
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
    )
}

export function expansionsValid(expansions: any) {
    var valid = true;
    if (!Array.isArray(expansions)) return false;
    expansions.map(exp => {
        if (exp != "ARR" && exp != "HW" && exp != "SB" && exp != "ShB" && exp != "EW") valid = false;
    });

    return valid;
}