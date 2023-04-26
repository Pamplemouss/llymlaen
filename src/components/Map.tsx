import {
    MapContainer,
    ImageOverlay,
    Marker,
    Polyline,
} from "react-leaflet";
import { CRS, Icon, LatLngBoundsExpression, LatLngExpression } from "leaflet";
import * as L from 'leaflet';
import { MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Control from 'react-leaflet-custom-control'
import Universe from '@/data/universe'
import { Map as FFMap, Zone } from '@/data/universe'
import GameContext from '@/components/GameContext';
import { invLerp, calculateDist } from '@/Utilities';
import LocationMarker from "@/components/map/LocationMarker";
import MapSetup from "@/components/map/MapSetup";
import GuessButton from "@/components/map/GuessButton";
import MapControl from "@/components/map/MapControl";
import MapMenu from "@/components/map/MapMenu";
import SubAreas from "@/components/map/SubAreas";
import GuessMarker from "./map/GuessMarker";
import { useCookies } from "react-cookie";


interface FuncProps {
    toFind: any,
    isMobile: boolean,
    isEdge: MutableRefObject<boolean>,
    is4k: MutableRefObject<boolean>,
    mapLevel?: number,
    leftCentered: boolean,
}

export default function Map({toFind, isMobile, isEdge, is4k, mapLevel, leftCentered}: FuncProps) {
    const [cookies, setCookie] = useCookies(['expansions']);
    const gameContext = useContext(GameContext);
    const blurControls = useAnimation();
    const Bounds = {
        CONTAINER: [[-180,-180], [180,180]] as LatLngBoundsExpression,
        CONTAINER_TS: [[-200,-350], [200,350]] as LatLngBoundsExpression,
        CONTAINER_TF: [[-200,-300], [200,300]] as LatLngBoundsExpression,
        OVERLAY: [[-110,-110], [110,110]] as LatLngBoundsExpression,
        THESOURCE: [[-110,-258], [110,258]] as LatLngBoundsExpression,
        THEFIRST: [[-110,-196], [110,196]] as LatLngBoundsExpression,
    }
    const [currentMap, setCurrentMap] = useState<FFMap>(cookies.expansions.length === 1 && cookies.expansions[0] === "ShB" ? Universe.getMap("Norvrandt") : Universe.TheSource);
    const [guessPos, setGuessPos] = useState<[number, number] | null>(null);
    const [polyline, setPolyline] = useState<LatLngExpression[] | null>(null);
    const [zonesMenuOpen, setZonesMenuOpen] = useState(false);
    const [regionsMenuOpen, setRegionsMenuOpen] = useState(false);
    const map = useRef<L.Map | null>(null)
    const geojson = useRef<L.GeoJSON | null>(null)
    const answerIcon = new Icon({
        iconUrl: "FFXIV_Quest_Icon.webp",
        iconAnchor: [24, 33],
        iconSize: [35, 35],
    });


    useEffect(() => {
        if (map.current === null) return;

        if (!gameContext.isPlaying) {
            if (guessPos === null) {
                map.current.setZoom(1, {animate: false});
            }
            else {
                var bounds = new L.LatLngBounds(toFind.pos, guessPos);
                map.current.fitBounds(bounds);
            }
        } 
    }, [gameContext.isPlaying])

    useEffect(() => {
        setTimeout(() => {
            map.current?.invalidateSize({pan: false});
        }, 200);
    }, [mapLevel])
    

    function guess() {
        if (guessPos === null) return;

        var calculScore = 0;
        var distFor100 = toFind.expansion === "ARR" ? 2 : 4;

        // region
        if (Universe.sameRegion(toFind.map, currentMap)) calculScore += gameContext.gameSystem.region;

        // map
        if (Universe.sameMap(toFind.map, currentMap)) calculScore += gameContext.gameSystem.map;

        // exact location
        if (currentMap.name === toFind.map.name) {
            var dist = Math.round(calculateDist(guessPos, toFind.pos));
            gameContext.setDistance(dist);
            if (dist <= distFor100) calculScore += gameContext.gameSystem.dist;
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

    function getZoom() {
        if (mapLevel === 1) {
            if (currentMap.name === "The Source" && is4k.current) return leftCentered ? 2.1 : 1         // world map + 4k
            else if (currentMap.name === "The Source") return leftCentered ? 1.1 : 0.1                  // world map
            else if (currentMap.name !== "The Source" && is4k.current) return 2.1                       // map + 4k
            else return 1.1                                                                             // map
        }
        else if (mapLevel === 2) {
            if (currentMap.name === "The Source" && is4k.current) return leftCentered ? 2.3 : 1.5       // world map + 4k
            else if (currentMap.name === "The Source") return leftCentered ? 1.3 : 0.5                  // world map
            else if (currentMap.name !== "The Source" && is4k.current) return 2.2                       // map + 4k
            else return 1.3                                                                             // map
        }
        else if (mapLevel === 3) {
            if (currentMap.name === "The Source" && is4k.current) return leftCentered ? 2.5 : 1.8       // world map + 4k
            else if (currentMap.name === "The Source") return leftCentered ? 1.5 : 0.8                  // world map
            else if (currentMap.name !== "The Source" && is4k.current) return 2.5                       // map + 4k
            else return 1.4                                                                             // map
        }
    }

    function getCenter() {
        if (!leftCentered || currentMap.name !== "The Source") return [0,0]

        if (mapLevel === 1 && currentMap.name === "The Source") {
            return [0, (Bounds.THESOURCE as Array<Array<number>>)[0][1] + 110]
        }
        else if (mapLevel === 2 && currentMap.name === "The Source") {
            return [0, (Bounds.THESOURCE as Array<Array<number>>)[0][1] + 145]
        }
        else if (mapLevel === 3 && currentMap.name === "The Source") {
            return [0, (Bounds.THESOURCE as Array<Array<number>>)[0][1] + 155]
        }
    }

    function getMaxBounds() {
        if (currentMap.name === "The Source") return Bounds.CONTAINER_TS;
        if (currentMap.name === "The First") return Bounds.CONTAINER_TF;
        return Bounds.CONTAINER;
    }

    function getBounds() {
        if (currentMap.name === "The Source") return Bounds.THESOURCE;
        if (currentMap.name === "The First") return Bounds.THEFIRST;
        return Bounds.OVERLAY;
    }

    async function changeLocation(target: FFMap) {
        if (!gameContext.isPlaying) return;
        if (target.name === currentMap.name) return;
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
        <div className={`overflow-hidden rounded-b-xl rounded-tr-xl relative h-full w-full ${isMobile ? "mobile" : ""}`}>
            <MapContainer
                center={getCenter() as LatLngExpression}
                zoomSnap={0.1}
                zoom={getZoom()}
                minZoom={(currentMap.name === "The Source" || currentMap.name === "The First") ? 0.1 : 0.5}
                maxZoom={5}
                crs={CRS.Simple}
                maxBounds={getMaxBounds()}
                attributionControl={false}
                zoomControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={false}
                key={currentMap.name + (currentMap.hasOwnProperty("region") ? "Z" : null)}
            >
                <ImageOverlay
                    bounds={getBounds()}
                    url={Universe.getMapUrl(currentMap, isEdge.current)}
                />
                <MapSetup map={map} currentMap={currentMap} geojson={geojson}></MapSetup>
                <GuessMarker currentMap={currentMap} setRegionsMenuOpen={setRegionsMenuOpen} setZonesMenuOpen={setZonesMenuOpen} guessPos={guessPos} setGuessPos={setGuessPos} is4k={is4k}></GuessMarker>
                <LineToAnswer/>
                <AnswerMarker/>

                {currentMap.markers.map((marker, index) => {
                    if (!Universe.isInExpansions(marker.target, cookies.expansions)) return;
                    return (
                        <LocationMarker map={map} key={"key" + marker.target.name + index} currentMap={currentMap} marker={marker} geojson={geojson} changeLocation={changeLocation}></LocationMarker>
                    )
                })}
                
                <Control prepend={true} position="topleft">
                    <MapMenu currentMap={currentMap} changeLocation={changeLocation} setRegionsMenuOpen={setRegionsMenuOpen} setZonesMenuOpen={setZonesMenuOpen} regionsMenuOpen={regionsMenuOpen} zonesMenuOpen={zonesMenuOpen}></MapMenu>
                    <MapControl currentMap={currentMap} map={map} changeLocation={changeLocation}></MapControl>
                </Control>

                <Control prepend={true} position="topright">
                    <SubAreas currentMap={currentMap} changeLocation={changeLocation}/>
                </Control>

                <Control prepend={true} position="bottomright">
                    <GuessButton currentMap={currentMap} TheSource={Universe.TheSource} guessPos={guessPos} guess={guess}></GuessButton>
                </Control>

            </MapContainer>
            <motion.div
                animate={blurControls}
                className="absolute top-0 left-0 w-full h-full z-20 backdrop-blur opacity-0 hidden"
            ></motion.div>
        </div>
    );
}
