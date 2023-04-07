import Link from 'next/link';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CookiePopup } from '@/components/CookiesManager';

export default function TopBar() {
    const [openPopup, setOpenPopup] = useState<boolean>(false);    

    useEffect(() => {
        window.addEventListener('mouseup', (e) => {
            if (typeof (e.target as any)!.closest !== 'function') return;
            if ((e?.target as HTMLElement).closest!(".popup") === null) setOpenPopup(false);
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
                    <CookiePopup setOpenPopup={setOpenPopup}></CookiePopup>
                )}
                
            </div>

        </div>
    )
}