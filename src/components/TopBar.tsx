import Link from 'next/link';

export default function TopBar() {
    return (
        <div className="px-5 flex h-16 w-full bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg shadow-black/50 items-center z-50">
            <Link href="/" className="h-full flex justify-center items-center">
                <img src="logo.png" className="h-[85%]"></img>
                <div className="text-xl text-emerald-400 neosans tracking-wider flex justify-center items-center ml-5">EORGUESSR</div>
            </Link>
        </div>
    )
}