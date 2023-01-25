import {
    MapContainer,
    ImageOverlay,
    Marker,
    useMapEvents,
    Tooltip,
} from "react-leaflet";
import { CRS, LatLng, Icon, Point, map } from "leaflet";
import { useState } from "react";

export default function Map() {
    const mapData = [
        {
            key: "northShrouds",
            url: "north_shrouds.png",
            markers: [
                {
                    name: "Central Shrouds",
                    latLng: [-61.8125, 11],
                    target: "centralShrouds",
                },
                { name: "Old Gridania", latLng: [-9.9375, 55.9375] },
                { name: "Coerthas Central Highlands", latLng: [-5.25, -47.75] },
            ],
        },
        {
            key: "centralShrouds",
            url: "central_shrouds.png",
            markers: [
                { name: "New Gridania", latLng: [41.625, 16.56] },
                { name: "New Gridania", latLng: [41, -26.5] },
                { name: "East Shrouds", latLng: [30.28, 45.56] },
                { name: "The Lavender Beds", latLng: [-31.625, 35.875] },
                { name: "South Shrouds", latLng: [-68.5, 15.375] },
                {
                    name: "North Shrouds",
                    latLng: [49.25, -49.25],
                    target: "northShrouds",
                },
            ],
        },
    ];

    const [currentMap, setCurrentMap] = useState(mapData[1]);

    const guessIcon = new Icon({
        iconUrl: "flag.png",
        iconAnchor: [5, 30],
        iconSize: [35, 35],
        className: "leaflet-guess-icon",
    });

    function GuessMarker() {
        const [position, setPosition] = useState<LatLng | null>(null);
        useMapEvents({
            click(e) {
                console.log(e.latlng.lat, ",", e.latlng.lng);
                setPosition(e.latlng);
            },
        });

        return position === null ? null : (
            <Marker position={position} icon={guessIcon}></Marker>
        );
    }

    function changeLocation(target: string | undefined) {
        mapData.map((map) => {
            if (map.key === target) setCurrentMap(map);
        });
    }

    return (
        <MapContainer
            center={[0, 0]}
            zoom={1}
            minZoom={1}
            maxZoom={5}
            crs={CRS.Simple}
            maxBounds={[
                [-100, -100],
                [100, 100],
            ]}
            attributionControl={false}
            scrollWheelZoom={true}
            doubleClickZoom={false}
        >
            <ImageOverlay
                bounds={[
                    [-100, -100],
                    [100, 100],
                ]}
                url={currentMap.url}
            />
            <GuessMarker />
            {currentMap.markers.map((element, index) => {
                return (
                    <Marker
                        key={"key" + element.name + index}
                        position={[element.latLng[0], element.latLng[1]]}
                        opacity={0}
                    >
                        <Tooltip
                            eventHandlers={{
                                click: () => {changeLocation(element.target)}
                            }}
                            permanent
                            direction="top"
                            offset={new Point(-16, 38)}
                            interactive={true}
                            className="hover:text-cyan-100 tracking-wide text-cyan-200 text-shadow-sm shadow-black text-base font-myriad bg-transparent shadow-none border-none before:border-none duration-200"
                        >
                            {element.name}
                        </Tooltip>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
