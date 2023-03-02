
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

const Coerthas : Region = {
    name: "Coerthas",
    markersRegion: [],
    markersZone: []
}



//--- ZONES ---//
// THE BLACK SHROUDS
const OldGridania : Zone = {
    name: "Old Gridania",
    region: TheBlackShrouds,
    markersZone: [],
}

const NewGridania : Zone = {
    name: "New Gridania",
    region: TheBlackShrouds,
    markersZone: [],
}

const CentralShroud : Zone = {
    name: "Central Shroud",
    region: TheBlackShrouds,
    markersZone: [],
}

const NorthShroud : Zone = {
    name: "North Shroud",
    region: TheBlackShrouds,
    markersZone: [],
}

const SouthShroud : Zone = {
    name: "South Shroud",
    region: TheBlackShrouds,
    markersZone: [],
}

const EastShroud : Zone = {
    name: "East Shroud",
    region: TheBlackShrouds,
    markersZone: [],
}

const TheLavenderBeds : Zone = {
    name: "The Lavender Beds",
    region: TheBlackShrouds,
    markersZone: [],
}

//THANALAN
const EasternThanalan : Zone = {
    name: "Eastearn Thanalan",
    region: Thanalan,
    markersZone: [],
}

//COERTHAS
const CoerthasCentralHighland : Zone = {
    name: "Coerthas Central Highland",
    region: Coerthas,
    markersZone: [],
}

// Add zones markers to regions
TheBlackShrouds.markersZone.push(
    {target: NewGridania, latLng: [34.25 , -3.75]},
    {target: OldGridania, latLng: [48.375 , -4.625]},
    {target: NorthShroud, latLng: [49.25, -49.25]},
    {target: CentralShroud, latLng: [0.0625 , 0.90625]},
    {target: SouthShroud, latLng: [-56 , 33]},
    {target: EastShroud, latLng: [45.75 , 63]},
    {target: TheLavenderBeds, latLng: [2.34375 , 47.25]},
);

// Add zones markers to zones
NewGridania.markersZone.push(
    {target: OldGridania, latLng: [5.5 , -25.5]},
    {target: OldGridania, latLng: [10.5 , 7.25]},
    {target: OldGridania, latLng: [3 , 28.75]},
    {target: CentralShroud, latLng: [-24.25 , -39.25]},
    {target: CentralShroud, latLng: [-37.5 , 52.75]},
);
OldGridania.markersZone.push(
    {target: NewGridania, latLng: [-1 , -23]},
    {target: NewGridania, latLng: [8.5 , 2.75]},
    {target: NewGridania, latLng: [-3.625 , 21.375]},
    {target: NorthShroud, latLng: [19.78125 , -64.75]},
    {target: TheLavenderBeds, latLng: [47.4375 , 66.5]},
    {target: EastShroud, latLng: [56.125 , 66.4375]},
);
NorthShroud.markersZone.push(
    {target: OldGridania, latLng: [-10.25 , 61.25]},
    {target: CentralShroud, latLng: [-69.03125 , 12.625]},
    {target: CoerthasCentralHighland, latLng: [-4.6875 , -53.625]},
);
CentralShroud.markersZone.push(
    {target: NorthShroud, latLng: [54.875 , -53.9375]},
    {target: OldGridania, latLng: [45.375 , -29.0625]},
    {target: OldGridania, latLng: [47.9375 , 18.0625]},
    {target: EastShroud, latLng: [33 , 51.28125]},
    {target: SouthShroud, latLng: [-75.84375 , 17.375]},
    {target: TheLavenderBeds, latLng: [-35.75, 40.875]},
);
SouthShroud.markersZone.push(
    {target: CentralShroud, latLng: [37.25 , -50.75]},
    {target: EastShroud, latLng: [41.125 , 37.75]},
    {target: EasternThanalan, latLng: [-88 , -37.875]},
);
EastShroud.markersZone.push(
    {target: OldGridania, latLng: [-8 , -80.375]},
    {target: CentralShroud, latLng: [-47.75 , -56]},
    {target: SouthShroud, latLng: [-65.25 , -15.625]},
);
TheLavenderBeds.markersZone.push(
    {target: CentralShroud, latLng: [-42.75 , 7.625]},
    {target: OldGridania, latLng: [-50.875 , 7.5625]},
);


var MapData = {
    regions: [TheBlackShrouds, Thanalan, Coerthas],
    zones: [
        NewGridania, OldGridania, CentralShroud, NorthShroud, EastShroud, SouthShroud, TheLavenderBeds,
    ],
}


export default MapData;
export type { Region, Zone }