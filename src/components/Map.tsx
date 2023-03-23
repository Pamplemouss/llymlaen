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
import Image from 'next/image'
import { motion, useAnimation } from "framer-motion";
import Control from 'react-leaflet-custom-control'
import TheSource from '../data/mapData'
import { Map as FFMap, Zone } from '../data/mapData'
import GameContext from '@/components/GameContext';
import { invLerp, calculateDist, getMapUrl, isRegion, getRegion } from '@/Utilities';


interface FuncProps {
    toFind: any;
}

export default function Map({toFind}: FuncProps) {
    const gameContext = useContext(GameContext);
    const blurControls = useAnimation();
    const guessControls = useAnimation();
    const Bounds = {
        CONTAINER: [[-180,-180], [180,180]] as LatLngBoundsExpression,
        CONTAINER_TS: [[-200,-350], [200,350]] as LatLngBoundsExpression,
        OVERLAY: [[-110,-110], [110,110]] as LatLngBoundsExpression,
        THESOURCE: [[-110,-258], [110,258]] as LatLngBoundsExpression,
    }
    const [currentMap, setCurrentMap] = useState<FFMap>(TheSource);
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

        if ((currentMap as Zone).region.name === toFind.map.region.name) calculScore += gameContext.gameSystem.region;
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

    function backOneLevel() {
        if (currentMap.hasOwnProperty("region")) changeLocation((currentMap as Zone).region);
        else changeLocation(TheSource);
    }

    function guessTooltip() {
        if (currentMap === TheSource) return "Pick a region";
        if (!currentMap.hasOwnProperty("region")) return "Pick a zone";
        if (guessPos === null) return "Place your pin on the map";
        return "Guess"
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

    
    function GuessButton() {
        useMapEvents({
            click(e) {
                if (currentMap.hasOwnProperty("region")) return;
                if (!(e.originalEvent.target as HTMLElement).classList.contains("leaflet-container")) return;
                guessControls.set({ opacity: 0.3 })
                guessControls.start({ opacity: 0 })
            },
        });

        return gameContext.isPlaying ? (
            <div onClick={() => guess()} className={`${guessPos == null ? "opacity-70" : "cursor-pointer"} guessBtn p-1.5 w-full group absolute bottom-0 right-0 z-10`}>
                <div className={`border relative overflow-hidden ${guessPos === null ? "disabled border-x-zinc-600 border-y-zinc-500 text-zinc-300" : "border-x-[#c0a270] border-y-[#e0c290] text-yellow-100"} text-sm py-1.5 tracking-wide px-8 font-semibold shadow-md shadow-[rgba(0,0,0,0.75)] rounded-full text-center ffxivBtn`}>
                    <span>{guessTooltip()}</span>
                    <motion.div animate={guessControls} className="absolute top-0 left-0 w-full h-full bg-white opacity-0"></motion.div>
                </div>
            </div>
        ) : null
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


    function PreloadMaps() {
        return (
            <div className="hidden relative">
                {currentMap.markers.map((marker, index) => {
                    return <img key={marker.target.name + "_preload"+index} src={"/"+ getMapUrl(marker.target)} alt="Preload img"></img>
                })}
            </div>
        )
    }

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

    async function changeLocation(target: FFMap) {
        if (!gameContext.isPlaying) return;
        setZonesMenuOpen(false);
        setRegionsMenuOpen(false);
        setGuessPos(null)

        await blurControls.start({
            display: "block",
            opacity: 1,
            transition: { duration: 0.1 },
        }).then(async () => {
            setCurrentMap(target);
            await blurControls.start({
                display: "block",
                opacity: 0,
                transition: { duration: 0.3 },
            }).then(() => {
                blurControls.start({
                    display: "none",
                })
            })
        });
    }

    // Calcultate the offset needed to start with the world map snapped to the left corners
    //const theSourceCenter : LatLngExpression = [(Bounds.THESOURCE as Array<Array<number>>)[0][0] - (Bounds.OVERLAY as Array<Array<number>>)[0][0], (Bounds.THESOURCE as Array<Array<number>>)[0][1] - (Bounds.OVERLAY as Array<Array<number>>)[0][1]];

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={currentMap.name === "The Source" ? [0,0] : [0,0]}
                zoomSnap={0.1}
                zoom={currentMap.name === "The Source" ? 0.1 : 1.1}
                minZoom={currentMap.name === "The Source" ? 0.1 : 0.5}
                maxZoom={5}
                crs={CRS.Simple}
                maxBounds={currentMap.name === "The Source" ? Bounds.CONTAINER_TS : Bounds.CONTAINER}
                attributionControl={false}
                zoomControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={false}
                key={currentMap.name}

            >
                <ImageOverlay
                    bounds={currentMap.name === "The Source" ? Bounds.THESOURCE : Bounds.OVERLAY}
                    url={getMapUrl(currentMap)}
                />
                <MapControl />
                <GuessMarker />
                <LineToAnswer />
                <AnswerMarker />

                {currentMap.markers.map((marker, index) => {
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
                                className="p-[2px] hover:text-cyan-100 tracking-wide text-cyan-200 text-shadow-sm shadow-black text-base font-myriad-cond bg-transparent shadow-none border-none before:border-none"
                            >
                                {marker.target.name}
                            </Tooltip>
                        </Marker>
                    );
                })}
                
                <Control prepend={true} position="topleft">
                    <div className="z-10 absolute w-9/12 -left-5 -top-2 h-20 flex opacity-50 shadow-[-40px_4px_8px_#000] blur-sm">
                        <div className="h-full bg-black grow"></div>
                        <div className="h-full w-2/12 bg-gradient-to-r from-black to-transparent"></div>
                    </div>
                    <div className="absolute left-6 top-2 text-yellow-50 z-20">
                        <div className="relative flex">
                            <div onClick={() => { if (gameContext.isPlaying) {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}}} className="dropdownMenu cursor-pointer">
                                <div className="h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center">
                                    <span className={`${regionsMenuOpen ? "rotate-90" : ""}`}>&#62;</span>
                                </div>
                                <div className="ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{getRegion(currentMap)?.name}</span></div>
                            </div>
                            {regionsMenuOpen && (
                                <div className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600">
                                    {TheSource.markers.map((marker) => {
                                        return (
                                            <div onClick={() => {changeLocation(marker.target) }} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={marker.target.name}>{marker.target.name}</div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="relative flex mt-3">
                            <div onClick={() => { if (gameContext.isPlaying) {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}}} className={`${currentMap.name !== "The Source" ? "cursor-pointer" : null} dropdownMenu`}>
                                <div className="overflow-hidden relative h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center">
                                    <span className={`${zonesMenuOpen && currentMap.name !== "The Source" ? "rotate-90" : ""}`}>&#62;</span>
                                    <div className={`${currentMap.name !== "The Source" ? "hidden" : null} h-full w-full z-10 absolute top-0 left-0 bg-slate-900/80`}></div>
                                </div>
                                <div className={`ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center`}><span>{isRegion(currentMap) ? "--" : (currentMap.name === "The Source" ? "" : currentMap.name)}</span></div>
                            </div>
                            {zonesMenuOpen && getRegion(currentMap) !== undefined ? (
                                <div className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600">
                                    {getRegion(currentMap).markers.map((zone) => {
                                        return (
                                            <div onClick={() => {changeLocation(zone.target) }} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={zone.target.name}>{zone.target.name}</div>
                                        )
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    
                    <div className="absolute top-0 -left-2 z-10">
                        <div onClick={() => changeLocation(TheSource)} className=" cursor-pointer p-0.5">
                            <div className="rounded shadow w-5 h-5 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                                <div className="w-3 h-2.5 shadow-sm shadow-yellow-200 border border-black m-auto"></div>
                            </div>
                        </div>
                        <div onClick={() => backOneLevel()} className=" cursor-pointer p-0.5">
                            <div className="flex justify-center items-center rounded shadow w-5 h-5 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                                <i className="text-slate-900 fa-solid fa-up-long text-shadow shadow-yellow-200/40  text-[0.8rem]"></i>
                            </div>
                        </div>
                        <div onClick={() => map?.zoomIn()} className=" cursor-pointer p-0.5">
                            <div className="flex justify-center items-center rounded shadow w-5 h-5 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                                <i className="text-slate-900 fa-solid fa-plus text-shadow shadow-yellow-200/40  text-[1rem]"></i>
                            </div>
                        </div>
                        <div onClick={() => map?.zoomOut()} className=" cursor-pointer p-0.5">
                            <div className="flex justify-center items-center rounded shadow w-5 h-5 shadow-black bg-gradient-to-tr from-[#513b1e] via-[#b49665] to-[#513b1e] hover:from-[#665033] hover:via-[#c9b17a] hover:to-[#665033] flex center-items">
                                <i className="text-slate-900 fa-solid fa-minus text-shadow shadow-yellow-200/40  text-[1rem]"></i>
                            </div>
                        </div>
                    </div> 
                </Control>

                <Control prepend={true} position="bottomright">
                    <GuessButton></GuessButton>
                </Control>

            </MapContainer>
            <motion.div
                animate={blurControls}
                className="absolute top-0 left-0 w-full h-full z-20 backdrop-blur opacity-0 hidden"
            ></motion.div>
            <PreloadMaps></PreloadMaps>
        </div>
    );
}
