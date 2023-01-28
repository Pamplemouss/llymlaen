import {
    MapContainer,
    ImageOverlay,
    Marker,
    useMapEvents,
    Tooltip,
} from "react-leaflet";
import { CRS, LatLng, Icon, Point, LatLngBoundsExpression } from "leaflet";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Control from 'react-leaflet-custom-control'
import MapData from '../data/mapData'
import { Region, Zone } from '../data/mapData'


export default function Map() {
    const controls = useAnimationControls();
    const bounds : LatLngBoundsExpression = ([[-110,-110], [110,110]]);
    const [currentMap, setCurrentMap] = useState<Zone | Region>(MapData.zones[0]);
    const [region, setRegion] = useState((currentMap as Zone).region);
    const [zonesMenuOpen, setZonesMenuOpen] = useState(false);
    const [regionsMenuOpen, setRegionsMenuOpen] = useState(false);
    const guessIcon = new Icon({
        iconUrl: "flag.png",
        iconAnchor: [5, 30],
        iconSize: [35, 35],
        className: "leaflet-guess-icon",
    });

    function getUrl(name: string) {
        return (name.toLowerCase().replaceAll(" ", "_") + ".png");
    }

    function GuessMarker() {
        const [position, setPosition] = useState<LatLng | null>(null);
        useMapEvents({
            click(e) {
                //console.log(e.latlng.lat, ",", e.latlng.lng);
                /*setZonesMenuOpen(false);
                setRegionsMenuOpen(false);*/
                setPosition(e.latlng);
            },
        });

        return position === null ? null : (
            <Marker position={position} icon={guessIcon}></Marker>
        );
    }

    async function changeLocation(target: Zone | Region) {
        setZonesMenuOpen(false);
        setRegionsMenuOpen(false);

        await controls.start({
            display: "block",
            opacity: 1,
            transition: { duration: 0.1 },
        }).then(async () => {
            setCurrentMap(target);
            await controls.start({
                display: "block",
                opacity: 0,
                transition: { duration: 0.1 },
            }).then(() => {
                controls.start({
                    display: "none",
                })
            })
        });
    }

    useEffect(() => {
        if (currentMap.hasOwnProperty("region")) setRegion((currentMap as Zone).region)
        else setRegion(currentMap as Region)
    }, [currentMap])

    return (
        <>
            <MapContainer
                key={currentMap.name}
                center={[0, 0]}
                zoom={1}
                minZoom={1}
                maxZoom={5}
                crs={CRS.Simple}
                maxBounds={bounds}
                attributionControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={false}
            >
                <ImageOverlay
                    bounds={[
                        [-110, -110],
                        [110, 110],
                    ]}
                    url={getUrl(currentMap.name)}
                />
                <GuessMarker />
                {currentMap.markersZone.map((marker, index) => {
                    return (
                        <Marker
                            key={"key" + marker.target.name + index}
                            position={[marker.latLng[0], marker.latLng[1]]}
                            opacity={0}
                        >
                            <Tooltip
                                eventHandlers={{
                                    click: () => {
                                        changeLocation(marker.target);
                                    },
                                }}
                                permanent
                                direction="top"
                                offset={new Point(-16, 38)}
                                interactive={true}
                                className="hover:text-cyan-100 tracking-wide text-cyan-200 text-shadow-sm shadow-black text-base font-myriad bg-transparent shadow-none border-none before:border-none"
                            >
                                {marker.target.name}
                            </Tooltip>
                        </Marker>
                    );
                })}
                
                <Control prepend={true} position="topleft">
                    <div className="z-10 absolute w-10/12 -left-5 -top-2 h-20 flex opacity-70">
                        <div className="h-full bg-slate-900 grow "></div>
                        <div className="h-full w-3/12 bg-gradient-to-r from-slate-900 to-transparent"></div>
                    </div>
                    <div className="absolute left-12 top-2 text-yellow-50 z-20">
                        <div className="relative flex">
                            <div onClick={() => {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${regionsMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                            <div onClick={() => {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{region.name}</span></div>
                            {regionsMenuOpen && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600"
                                >
                                    {MapData.regions.map((region) => {
                                        return (
                                            <div onClick={() => {changeLocation(region) }} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={region.name}>{region.name}</div>
                                        )
                                    })}
                                </motion.div>
                            )}
                        </div>
                        <div className="relative flex mt-3">
                            <div onClick={() => {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${zonesMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                            <div onClick={() => {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{currentMap.hasOwnProperty("region") ? currentMap.name : "--"}</span></div>
                            {zonesMenuOpen ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600"
                                >
                                    {region.markersZone.map((zone) => {
                                        return (
                                            <div onClick={() => {changeLocation(zone.target) }} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={zone.target.name}>{zone.target.name}</div>
                                        )
                                    })}
                                </motion.div>
                            ) : null}
                        </div>
                    </div>
                </Control>

            </MapContainer>
            <motion.div
                animate={controls}
                className="absolute top-0 left-0 w-full h-full z-20 backdrop-blur opacity-0 hidden"
            ></motion.div>
        </>
    );
}
