import { Point } from "leaflet";
import { MutableRefObject } from "react";
import { Marker, Tooltip } from "react-leaflet";

interface Props {
    isExit: boolean,
    map: MutableRefObject<L.Map | null>,
    marker: any,
    geojson: MutableRefObject<L.GeoJSON | null>,
    changeLocation: any
}

export default function LocationMarker({isExit, map, marker, geojson, changeLocation} : Props) {
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
                {marker.target.name}
            </Tooltip>
        </Marker>
    )
}