import { Point } from "leaflet";
import { MutableRefObject } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { Map as FFMap } from '@/data/universe'
import Universe from '@/data/universe'


interface Props {
    currentMap: FFMap,
    map: MutableRefObject<L.Map | null>,
    marker: any,
    geojson: MutableRefObject<L.GeoJSON | null>,
    changeLocation: any
}

export default function LocationMarker({currentMap, map, marker, geojson, changeLocation} : Props) {
    function getLocationName() {
        if (marker.target.subAreas !== undefined) {
            if (currentMap.menuName !== marker.target.menuName) return marker.target.menuName
            else return marker.target.name;
        }
        else return marker.target.name;
    }

    var isExit = (Universe.isWorldMap(currentMap) ? false : Universe.sameRegion(currentMap, marker.target))

    return (
        <Marker
            position={[marker.latLng[0], marker.latLng[1]]}
            opacity={0}
        >
            <Tooltip
                eventHandlers={{
                    click: () => {
                        changeLocation(marker.target);
                    },
                    mouseover: (e) => {
                        for (var key of Object.keys((map as any).current._layers)) {
                            var layer = (map as any).current._layers[key];
                            if (layer.hasOwnProperty("feature") && layer.feature.properties.name === marker.target.name) layer.setStyle({fillOpacity: 0.15});
                        }
                    },
                    mouseout: (e) => {
                        for (var key of Object.keys((map as any).current._layers)) {
                            var layer = (map as any).current._layers[key];
                            if (layer.hasOwnProperty("feature") && layer.feature.properties.name === marker.target.name) geojson.current!.resetStyle(layer);
                        }
                    }
                }}
                permanent
                direction="top"
                offset={new Point(-16, 38)}
                interactive={true}
                className={`p-[2px] ${isExit ? "tooltipRegion text-[rgb(245,215,120)] shadow-yellow-900/80" : "text-cyan-200 shadow-black"} tracking-wide text-shadow-sm text-base 4k:text-3xl font-myriad-cond bg-transparent shadow-none border-none before:border-none`}
            >
                <span id={marker.target.name}></span>
                {getLocationName()}
            </Tooltip>
        </Marker>
    )
}