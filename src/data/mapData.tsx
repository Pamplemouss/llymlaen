
type Zone = {
    name: string;
    region: Region;
    markersZone: {target: Zone, latLng: [number, number]}[];
}

type Region = {
    name: string;
    markersRegion: {target: Region, latLng: [number, number]}[];
    markersZone: {target: Zone, latLng: [number, number]}[];
}


//REGIONS
const Thanalan : Region = {
    name: "Thanalan",
    markersRegion: [],
    markersZone: []
}

const TheBlackShrouds : Region = {
    name: "The Black Shrouds",
    markersRegion: [{target: Thanalan, latLng: [10,10]}],
    markersZone: []
}


// ZONES
const CentralShrouds : Zone = {
    name: "Central Shrouds",
    region: TheBlackShrouds,
    markersZone: [],
}

const NorthShrouds : Zone = {
    name: "North Shrouds",
    region: TheBlackShrouds,
    markersZone: [],
}

// Add zones markers to regions
TheBlackShrouds.markersZone.push({target: NorthShrouds, latLng: [49.25, -49.25]})
TheBlackShrouds.markersZone.push({target: CentralShrouds, latLng: [49.25, -49.25]})

// Add zones markers to zones
CentralShrouds.markersZone.push({target: NorthShrouds, latLng: [49.25, -49.25]});
NorthShrouds.markersZone.push({target: CentralShrouds, latLng: [49.25, -49.25]});


var MapData = {
    regions: [Thanalan, TheBlackShrouds],
    zones: [CentralShrouds, NorthShrouds],
}


export default MapData;
export type { Region, Zone }