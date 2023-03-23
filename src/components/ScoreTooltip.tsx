export default function ScoreToolTip() {

    return (
        <div className="group absolute top-1 right-2 z-50 p-2">
            <i className="fa-solid fa-circle-info text-shadow-lg shadow-black/20 text-slate-600 text-xl group-hover:text-slate-400" aria-hidden="true"></i>     
            <div className="duration-200 scale-0 group-hover:scale-100 origin-bottom absolute top-0 right-1/2 bg-gradient-to-b from-blue-800 to-blue-900 border-2 border-x-[#c0a270] border-y-[#e0c290] shadow shadow-black/50 translate-x-1/2 -translate-y-full p-3 rounded-lg">
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