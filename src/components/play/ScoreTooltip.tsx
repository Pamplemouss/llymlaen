interface Props {
    isMobile: boolean
}

export default function ScoreToolTip({ isMobile } : Props) {
    return (
        <div className="group absolute top-1 right-2 z-50 p-2">
            <i className="fa-solid fa-circle-info text-shadow-lg shadow-black/20 text-white/90 text-xl 4k:text-3xl group-hover:text-white" aria-hidden="true"></i>     
            <div className={`${isMobile ? "origin-top-right top-0 right-10" : "origin-bottom top-0 right-1/2 translate-x-1/2 -translate-y-full" } 4k:text-xl duration-200 scale-0 group-hover:scale-100 absolute bg-gradient-to-b from-blue-800 to-blue-900 border-2 border-x-[#c0a270] border-y-[#e0c290] shadow shadow-black/50 p-3 rounded-lg`}>
                <div className="flex gap-1 whitespace-nowrap items-center">
                    <i className="text-shadow-lg shadow-black/20 text-yellow-200 fa fa-star" aria-hidden="true"></i>
                    <i className="text-shadow-lg shadow-black/20 text-slate-500 fa fa-star" aria-hidden="true"></i>
                    <i className="text-shadow-lg shadow-black/20 text-slate-500 fa fa-star" aria-hidden="true"></i>
                    <span className="text-slate-200 ml-3 font-neosans">Region</span>
                </div>
                <div className="flex gap-1 whitespace-nowrap items-center">
                    <i className="text-shadow-lg shadow-black/20 text-yellow-200 fa fa-star" aria-hidden="true"></i>
                    <i className="text-shadow-lg shadow-black/20 text-yellow-200 fa fa-star" aria-hidden="true"></i>
                    <i className="text-shadow-lg shadow-black/20 text-slate-500 fa fa-star" aria-hidden="true"></i>
                    <span className="text-slate-200 ml-3 font-neosans">Map</span>
                </div>
                <div className="flex gap-1 whitespace-nowrap items-center">
                    <i className="text-shadow-lg shadow-black/20 text-yellow-200 fa fa-star" aria-hidden="true"></i>
                    <i className="text-shadow-lg shadow-black/20 text-yellow-200 fa fa-star" aria-hidden="true"></i>
                    <i className="text-shadow-lg shadow-black/20 text-yellow-200 fa fa-star" aria-hidden="true"></i>
                    <span className="text-slate-200 ml-3 font-neosans"> Exact location</span>
                </div>
            </div>
        </div>
    )
}