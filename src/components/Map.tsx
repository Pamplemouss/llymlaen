import {
    MapContainer,
    ImageOverlay,
    Marker,
    useMapEvents,
    Tooltip,
    Polyline,
    useMap,
} from "react-leaflet";
import { CRS, LatLng, Icon, Point, LatLngBoundsExpression, LatLngExpression } from "leaflet";
import * as L from 'leaflet';
import { useContext, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Control from 'react-leaflet-custom-control'
import MapData from '../data/mapData'
import { Region, Zone } from '../data/mapData'
import GameContext from '@/components/GameContext';
import { invLerp, calculateDist, getUrl } from '@/Utilities';


interface FuncProps {
    toFind: any;
}

export default function Map({toFind}: FuncProps) {
    const gameContext = useContext(GameContext);
    const controls = useAnimationControls();
    const bounds : LatLngBoundsExpression = ([[-110,-110], [110,110]]);
    const [currentMap, setCurrentMap] = useState<Zone | Region>(MapData[0]);
    const [region, setRegion] = useState((currentMap as Region));
    const [guessPos, setGuessPos] = useState<[number, number] | null>(null);
    const [polyline, setPolyline] = useState<LatLngExpression[] | null>(null);
    const [zonesMenuOpen, setZonesMenuOpen] = useState(false);
    const [regionsMenuOpen, setRegionsMenuOpen] = useState(false);
    const guessIcon = new Icon({
        iconUrl: "guess.png",
        iconAnchor: [24, 33],
        iconSize: [35, 35],
    });
    const answerIcon = new Icon({
        iconUrl: "FFXIV_Quest_Icon.webp",
        iconAnchor: [24, 33],
        iconSize: [35, 35],
    });
    var map : L.Map | null = null;

    function guess() {
        if (guessPos === null) return;

        var calculScore = 0;

        if (region.name === toFind.map.region.name) calculScore += gameContext.gameSystem.region;
        if (currentMap.name === toFind.map.name) calculScore += gameContext.gameSystem.map;
        if (currentMap.name === toFind.map.name) {
            var dist = calculateDist(guessPos, toFind.pos);
            gameContext.setDistance(dist);
            if (dist < 2) calculScore += gameContext.gameSystem.dist;
            else if (dist < gameContext.gameSystem.distMax) calculScore += (invLerp(gameContext.gameSystem.distMax,2,dist) * gameContext.gameSystem.dist);
        }
        
        gameContext.setScore(Math.floor(calculScore));
        gameContext.setIsPlaying(false);
        setZonesMenuOpen(false);
        setRegionsMenuOpen(false);
        if (currentMap.name === toFind.map.name) {
            setPolyline([[guessPos[0], guessPos[1]], [toFind.pos[0], toFind.pos[1]]]);
        }
        else {
            changeLocation(toFind.map);
        }        
    }

    function GuessMarker() {
        useMapEvents({
            click(e) {
                console.log(e.latlng.lat + ", " + e.latlng.lng)
                if (!gameContext.isPlaying) return;
                if (!currentMap.hasOwnProperty("region")) return; // Don't place marker if in region mode
                if ((e.originalEvent.target as Element)!.classList.contains("leaflet-container")) {
                    setZonesMenuOpen(false);
                    setRegionsMenuOpen(false);
                    setGuessPos([e.latlng.lat, e.latlng.lng]);
                }
            },
        });

        return guessPos === null ? null : (
            <Marker position={new LatLng(guessPos[0],guessPos[1])} icon={guessIcon}></Marker>
        );
    }
    
    function MapControl() {
        map = useMap();

        return null;
    }


    useEffect(() => {
        if (map === null) return;

        if (!gameContext.isPlaying) {
            if (guessPos === null) {
                map.setZoom(1, {animate: false});
            }
            else {
                var bounds = new L.LatLngBounds(toFind.pos, guessPos);
                map.fitBounds(bounds);
            }
        } 
    }, [gameContext.isPlaying])



    function LineToAnswer() {
        return (polyline !== null && currentMap.name === toFind.map.name) ? (
            <Polyline pathOptions={{color: "black", dashArray: "1 8"}} positions={polyline} />
        ) : null;
    }

    function AnswerMarker() {
        return (!gameContext.isPlaying && currentMap.name === toFind.map.name) ? (
            <Marker position={toFind.pos} icon={answerIcon}></Marker>
        ) : null;
    }

    async function changeLocation(target: Zone | Region) {
        if (!gameContext.isPlaying) return;
        setZonesMenuOpen(false);
        setRegionsMenuOpen(false);
        setGuessPos(null)

        await controls.start({
            display: "block",
            opacity: 1,
            transition: { duration: 0.1 },
        }).then(async () => {
            setCurrentMap(target);
            await controls.start({
                display: "block",
                opacity: 0,
                transition: { duration: 0.3 },
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
        <div className="relative h-full w-full">
            <MapContainer
                center={[0, 0]}
                zoom={1}
                minZoom={1}
                maxZoom={5}
                crs={CRS.Simple}
                maxBounds={bounds}
                attributionControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={false}
                key={currentMap.name}

            >
                <ImageOverlay
                    bounds={[
                        [-110, -110],
                        [110, 110],
                    ]}
                    url={"maps/" + (currentMap.hasOwnProperty("region") ? (currentMap as Zone).region.name + "/" : "") + getUrl(currentMap.name)}
                />
                <MapControl />
                <GuessMarker />
                <LineToAnswer />
                <AnswerMarker />

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
                                className="p-[2px] hover:text-cyan-100 tracking-wide text-cyan-200 text-shadow-sm shadow-black text-base font-myriad bg-transparent shadow-none border-none before:border-none"
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
                            <div onClick={() => { if (gameContext.isPlaying) {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${regionsMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                            <div onClick={() => { if (gameContext.isPlaying) {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{region.name}</span></div>
                            {regionsMenuOpen && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600"
                                >
                                    {MapData.map((region) => {
                                        return (
                                            <div onClick={() => {changeLocation(region) }} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={region.name}>{region.name}</div>
                                        )
                                    })}
                                </motion.div>
                            )}
                        </div>
                        <div className="relative flex mt-3">
                            <div onClick={() => { if (gameContext.isPlaying) {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${zonesMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                            <div onClick={() => { if (gameContext.isPlaying) {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{currentMap.hasOwnProperty("region") ? currentMap.name : "--"}</span></div>
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
                <Control position="bottomright">
                    { gameContext.isPlaying && currentMap.hasOwnProperty("region") ? (
                        <div onClick={() => guess()} className={`${guessPos == null ? "opacity-50" : ""} py-1 px-6 text-slate-200 font-semibold shadow-md shadow-[rgba(0,0,0,0.75)] text-yellow-100 cursor-pointer rounded-full text-center ffxivBtn group`}><span className={`${guessPos == null ? "" : "group-hover:text-shadow group-hover:shadow-amber-300/50"} duration-200`}>Guess</span></div>
                    ) : null}
                </Control>

            </MapContainer>
            <motion.div
                animate={controls}
                className="absolute top-0 left-0 w-full h-full z-20 backdrop-blur opacity-0 hidden"
            ></motion.div>
        </div>
    );
}
