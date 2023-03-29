import { useContext } from "react";
import { Map as FFMap } from '@/data/mapData'
import GameContext from "../GameContext";
import { useMapEvents, Marker } from "react-leaflet";
import { Icon, LatLng } from "leaflet";

/* import '@geoman-io/leaflet-geoman-free';  
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';   */

interface Props {
    currentMap: FFMap,
    setRegionsMenuOpen: any,
    setZonesMenuOpen: any,
    guessPos: [number, number] | null,
    setGuessPos: any,
}

export default function GuessMarker({currentMap, setRegionsMenuOpen, setZonesMenuOpen, guessPos, setGuessPos} : Props) {
    const gameContext = useContext(GameContext);
    const guessIcon = new Icon({
        iconUrl: "guess.png",
        iconAnchor: [24, 33],
        iconSize: [35, 35],
    });
    
    useMapEvents({
        click(e) {
            console.log((Math.round(e.latlng.lat * 1000)/1000) + ", " + (Math.round(e.latlng.lng * 1000)/1000))
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

