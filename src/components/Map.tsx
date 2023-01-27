import {
    MapContainer,
    ImageOverlay,
    Marker,
    useMapEvents,
    Tooltip,
} from "react-leaflet";
import { CRS, LatLng, Icon, Point } from "leaflet";
import { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Control from 'react-leaflet-custom-control'


export default function Map() {
    const controls = useAnimationControls();
    const mapData = {
        zones: [
            {
                key: "North Shrouds",
                region: "The Black Shroud",
                url: "north_shrouds.png",
                markers: [
                    { name: "Central Shrouds", latLng: [-61.8125, 11] },
                    { name: "Old Gridania", latLng: [-9.9375, 55.9375] },
                    { name: "Coerthas Central Highlands", latLng: [-5.25, -47.75] },
                ],
            },
            {
                key: "Central Shrouds",
                region: "The Black Shroud",
                url: "central_shrouds.png",
                markers: [
                    { name: "New Gridania", latLng: [41.625, 16.56] },
                    { name: "New Gridania", latLng: [41, -26.5] },
                    { name: "East Shrouds", latLng: [30.28, 45.56] },
                    { name: "The Lavender Beds", latLng: [-31.625, 35.875] },
                    { name: "South Shrouds", latLng: [-68.5, 15.375] },
                    { name: "North Shrouds", latLng: [49.25, -49.25] },
                ],
            },
        ],
        regions: [
            "The Black Shroud", "Thanalan","Noscea"
        ]
    };

    const [currentMap, setCurrentMap] = useState(mapData.zones[1]);
    const [zonesMenuOpen, setZonesMenuOpen] = useState(false);
    const [regionsMenuOpen, setRegionsMenuOpen] = useState(false);

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

    async function changeLocation(target: string | undefined) {
        await controls.start({
            display: "block",
            opacity: 1,
            transition: { duration: 0.1 },
        }).then(async () => {
            mapData.zones.map((map) => {
                if (map.key === target) setCurrentMap(map);
            });
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

    return (
        <>
            <MapContainer
                key={currentMap.key}
                center={[0, 0]}
                zoom={1}
                minZoom={1}
                maxZoom={5}
                crs={CRS.Simple}
                maxBounds={[
                    [-110, -110],
                    [110, 110],
                ]}
                attributionControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={false}
            >
                <ImageOverlay
                    bounds={[
                        [-110, -110],
                        [110, 110],
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
                                    click: () => {
                                        changeLocation(element.name);
                                    },
                                }}
                                permanent
                                direction="top"
                                offset={new Point(-16, 38)}
                                interactive={true}
                                className="hover:text-cyan-100 tracking-wide text-cyan-200 text-shadow-sm shadow-black text-base font-myriad bg-transparent shadow-none border-none before:border-none"
                            >
                                {element.name}
                            </Tooltip>
                        </Marker>
                    );
                })}
                
                {/* <MapNavControl mapData={mapData}></MapNavControl> */}
                <Control prepend={true} position="topleft">
                    <div className="z-10 absolute w-10/12 -left-5 -top-2 h-20 flex opacity-70">
                        <div className="h-full bg-slate-900 grow "></div>
                        <div className="h-full w-3/12 bg-gradient-to-r from-slate-900 to-transparent"></div>
                    </div>
                    <div className="absolute left-12 top-2 text-yellow-50 z-20">
                        <div className="relative flex">
                            <div onClick={() => {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${regionsMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                            <div onClick={() => {setRegionsMenuOpen(!regionsMenuOpen); setZonesMenuOpen(false)}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{currentMap.region}</span></div>
                            {regionsMenuOpen && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600"
                                >
                                    {mapData.regions.map((region) => {
                                        return (
                                            <div className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={region}>{region}</div>
                                        )
                                    })}
                                </motion.div>
                            )}
                        </div>
                        <div className="relative flex mt-3">
                            <div onClick={() => {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}} className="cursor-pointer h-5 w-5 select-none text-gray-300 text-base font-bold ffxivBtn rounded-full text-center shadow-[0px_1px_5px_rgba(0,0,0,0.7)] inline-flex justify-center items-center"><span className={`duration-200 ${zonesMenuOpen ? "rotate-90" : ""}`}>&#62;</span></div>
                            <div onClick={() => {setZonesMenuOpen(!zonesMenuOpen); setRegionsMenuOpen(false)}} className="cursor-pointer ml-2 text-sm text-shadow shadow-amber-300/50 inline-flex justify-center items-center"><span>{currentMap.key}</span></div>
                            {zonesMenuOpen ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute z-20 px-1 py-2 top-5 left-6 bg-[#4a4a4a] rounded flex flex-col gap-1 border border-x-2 border-y-neutral-500 border-x-neutral-600"
                                >
                                    {mapData.zones.map((zone) => {
                                        if (zone.region == currentMap.region) {
                                            return (
                                                <div onClick={() => {changeLocation(zone.key); setZonesMenuOpen(false)}} className="hover:bg-gradient-to-r hover:from-orange-300/30 hover:to-transparent px-2 rounded-full cursor-pointer whitespace-nowrap text-amber-100 text-shadow-[0px_1px_1px_rgba(0,0,0,0.85)] text-sm" key={zone.key}>{zone.key}</div>
                                            )
                                        }
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
