import L from "leaflet";
import { MutableRefObject } from "react";
import { useMap } from "react-leaflet";
import { Map as FFMap } from '@/data/universe'

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

interface Props {
    currentMap: FFMap,
    map: MutableRefObject<L.Map | null>,
    geojson: MutableRefObject<L.GeoJSON | null>,
}

export default function MapSetup({currentMap, map, geojson} : Props) {
    map.current = useMap();

    // GEOJSON CREATOR
    (map.current as any).pm.addControls({  
        position: 'topleft',  
        drawCircle: false,  
        }); 

    map.current.on('pm:create', function(e) {
        var latlngs = e.layer.getLatLngs();
        var polygon : any[] = [];
        latlngs[0].map((latlng: any) => {
            polygon.push([latlng.lng, latlng.lat]);
        })
        console.log(JSON.stringify(polygon))
    });
    // GEOJSON CREATOR

    function highlightFeature(e : any) {
        var thisLayer = e.target;
        for (var key of Object.keys((map.current as any)._layers)) {
            var layer = (map.current as any)._layers[key];
            if (layer.hasOwnProperty("feature") && layer.feature.properties.name === thisLayer.feature.properties.target) layer.setStyle({fillOpacity: 0.15});
        }
    
        Array.from(document.getElementsByClassName("leaflet-tooltip")).forEach(tooltip => {
            if (tooltip.innerHTML === thisLayer.feature.properties.target) (tooltip as HTMLElement).classList.add("tooltipHighlight");
        })
    }
    
    function resetHighlight(e : any) {
        var thisLayer = e.target;
        for (var key of Object.keys((map.current as any)._layers)) {
            var layer = (map.current as any)._layers[key];
            if (layer.hasOwnProperty("feature") && layer.feature.properties.name === thisLayer.feature.properties.target) geojson.current!.resetStyle(layer);
        }
    
        Array.from(document.getElementsByClassName("leaflet-tooltip")).forEach(tooltip => {
            if (tooltip.innerHTML === e.target.feature.properties.target) (tooltip as HTMLElement).classList.remove("tooltipHighlight");
        })
    }
    
    function onEachFeature(feature : any, layer : any) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: () => {
                Array.from(document.getElementsByClassName("leaflet-tooltip")).forEach(tooltip => {
                    if (tooltip.innerHTML === feature.properties.target) (tooltip as HTMLElement).click();
                })
            }
        });
    }
    

    if (!(map.current as any).areaPolygonsLoaded) {
        var polygonsData = {"type":"FeatureCollection","features":
            currentMap.markers.filter(marker => marker.hasOwnProperty("geojson")).map((marker, index) => {
                var type = (marker.geojson?.polygons.length === 1 ? "Polygon" : "MultiPolygon");
                var coordinates = (type === "Polygon" ? marker.geojson!.polygons[0] : marker.geojson?.polygons);
                return {
                    "type":"Feature","id": index,"properties":{"name":marker.target.name},"geometry":{"type": type,"coordinates":[coordinates]}
                }
            })
        };

        var hitboxData = {"type":"FeatureCollection","features":
            currentMap.markers.filter(marker => marker.hasOwnProperty("geojson")).map((marker, index) => {
                var type = (marker.geojson?.hitbox?.length === 1 ? "Polygon" : "MultiPolygon");
                var coordinates = (type === "Polygon" ? marker.geojson!.hitbox![0] : marker.geojson?.hitbox!);
                return {
                    "type":"Feature","id": index,"properties":{"target":marker.target.name},"geometry":{"type": type,"coordinates":[coordinates]}
                }
            })
        };

        geojson.current = L.geoJson(polygonsData as any, {style: {fillOpacity: 0, fillColor: 'white', color: undefined}}).addTo(map.current);
        L.geoJson(hitboxData as any, {style: {fillOpacity: 0, color: undefined}, onEachFeature: onEachFeature}).addTo(map.current);

        (map.current as any).areaPolygonsLoaded = true;
    }
    

    return null;
}

