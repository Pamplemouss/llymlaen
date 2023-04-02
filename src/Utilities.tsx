import TheSource from './data/mapData'
import { Map, Zone } from './data/mapData'

export function calculateDist(p1: [number, number], p2: [number, number]) {
    return Math.pow((Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[1] - p2[1]), 2)), 0.5);
}

export function invLerp(from: number, to: number, value: number) {
    return (value - from) / (to - from);
}

export function toSnakeCase(name: string) {
    return name.toLowerCase().replaceAll(" ", "_");
}

export function getMapUrl(map: Map, isEdge: boolean) {
    var format : string;
    isEdge ? format = ".webp" : format = ".avif"
    return "maps/" + (map.hasOwnProperty("region") ? (map as Zone).region.name + "/" : "") + map.name + format
}

export function isRegion(map: Map) {
    var isRegion : boolean = false;
    TheSource.markers.forEach(marker => {
        if (marker.target === map) isRegion = true;
    })

    return isRegion;
}

export function getRegion(map: Map) {
    if (isRegion(map)) return map;
    else return (map as Zone).region;
}