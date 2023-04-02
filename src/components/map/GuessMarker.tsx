import { MutableRefObject, useContext } from "react";
import { Map as FFMap } from '@/data/mapData'
import GameContext from "../GameContext";
import { useMapEvents, Marker } from "react-leaflet";
import { Icon, LatLng } from "leaflet";


interface Props {
    currentMap: FFMap,
    setRegionsMenuOpen: any,
    setZonesMenuOpen: any,
    guessPos: [number, number] | null,
    setGuessPos: any,
    is4k: MutableRefObject<boolean>
}

export default function GuessMarker({currentMap, setRegionsMenuOpen, setZonesMenuOpen, guessPos, setGuessPos, is4k} : Props) {
    const gameContext = useContext(GameContext);
    const guessIcon = new Icon({
        iconUrl: "guess.png",
        iconAnchor: is4k.current ? [48, 66] : [24, 33],
        iconSize: is4k.current ? [70, 70] : [35, 35],
    });
    
    useMapEvents({
        click(e) {
            console.log((Math.round(e.latlng.lat * 1000)/1000) + ", " + (Math.round(e.latlng.lng * 1000)/1000))
            if (!gameContext.isPlaying) return;
            if ((e.originalEvent.target as Element)!.classList.contains("leaflet-container")) {    
                setZonesMenuOpen(false);
                setRegionsMenuOpen(false);
            }
            if (!currentMap.hasOwnProperty("region")) return; // Don't place marker if in region mode

            if ((e.originalEvent.target as Element)!.classList.contains("leaflet-container")) {    
                setGuessPos([e.latlng.lat, e.latlng.lng]);
            }
            
        },
    });

    return guessPos === null ? null : (
        <Marker position={new LatLng(guessPos[0],guessPos[1])} icon={guessIcon}></Marker>
    );
}

