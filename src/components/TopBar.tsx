import Link from 'next/link';
import Image from 'next/image'

export default function TopBar() {
    return (
        <div className="fixed top-0 left-0 px-5 flex h-16 4k:h-24 w-full bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg shadow-black/50 items-center z-50">
            <Link href="/" className="h-full flex justify-center items-center">
                <div className="h-[85%] aspect-square relative">
                    <Image alt="logo" fill src="/logo.png" sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw" className="object-contain"></Image>
                </div>
                <div className="text-xl 4k:text-2xl text-emerald-400 font-neosans tracking-wider flex justify-center items-center ml-5">EORGUESSR</div>
            </Link>
        </div>
    )
}