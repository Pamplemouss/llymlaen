import {
    MapContainer,
    ImageOverlay,
    Marker,
    Polyline,
} from "react-leaflet";
import { CRS, Icon, LatLngBoundsExpression, LatLngExpression } from "leaflet";
import * as L from 'leaflet';
import { useContext, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Control from 'react-leaflet-custom-control'
import TheSource from '../data/mapData'
import { Map as FFMap, Zone } from '../data/mapData'
import GameContext from '@/components/GameContext';
import { invLerp, calculateDist, getMapUrl, getRegion } from '@/Utilities';
import LocationMarker from "./map/LocationMarker";
import MapSetup from "./map/MapSetup";
import GuessButton from "./map/GuessButton";
import MapControl from "./map/MapControl";
import MapMenu from "./map/MapMenu";
import GuessMarker from "./map/GuessMarker";


interface FuncProps {
    toFind: any,
    isMobile: boolean,
}

export default function Map({toFind, isMobile}: FuncProps) {
    const gameContext = useContext(GameContext);
    const blurControls = useAnimation();
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
        <div className={`relative h-full w-full ${isMobile ? "mobile" : ""}`}>
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
                key={currentMap.name + (currentMap.hasOwnProperty("region") ? "Z" : null)}

            >
                <ImageOverlay
                    bounds={currentMap.name === "The Source" ? Bounds.THESOURCE : Bounds.OVERLAY}
                    url={getMapUrl(currentMap)}
                />
                <MapSetup map={map} currentMap={currentMap} geojson={geojson}></MapSetup>
                <GuessMarker currentMap={currentMap} setRegionsMenuOpen={setRegionsMenuOpen} setZonesMenuOpen={setZonesMenuOpen} guessPos={guessPos} setGuessPos={setGuessPos}></GuessMarker>
                <LineToAnswer />
                <AnswerMarker />

                {currentMap.markers.map((marker, index) => {
                    var isExit = (currentMap === TheSource ? false : (getRegion(currentMap) !== getRegion(marker.target)))
                    return (
                        <LocationMarker map={map} key={"key" + marker.target.name + index} marker={marker} isExit={isExit} geojson={geojson} changeLocation={changeLocation}></LocationMarker>
                    )
                })}
                
                <Control prepend={true} position="topleft">
                    <MapMenu currentMap={currentMap} TheSource={TheSource} changeLocation={changeLocation} setRegionsMenuOpen={setRegionsMenuOpen} setZonesMenuOpen={setZonesMenuOpen} regionsMenuOpen={regionsMenuOpen} zonesMenuOpen={zonesMenuOpen}></MapMenu>
                    <MapControl currentMap={currentMap} map={map} changeLocation={changeLocation} TheSource={TheSource}></MapControl>
                </Control>

                <Control prepend={true} position="bottomright">
                    <GuessButton currentMap={currentMap} TheSource={TheSource} guessPos={guessPos} guess={guess}></GuessButton>
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
