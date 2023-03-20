type Map = {
    name: string;
    markers: {target: Map, latLng: [number, number]}[];
}

type Zone = Map & {region: Map}


// WORLD Map
const TheSource : Map = {
    name: "The Source",
    markers: [],
}


// REGIONS
const Thanalan : Map = {
    name: "Thanalan",
    markers: []
}

const TheBlackShrouds : Map = {
    name: "The Black Shrouds",
    markers: []
}

const LaNoscea : Map = {
    name: "La Noscea",
    markers: []
}

const Coerthas : Map = {
    name: "Coerthas",
    markers: []
}

const MorDhona : Map = {
    name: "Mor Dhona",
    markers: []
}



//--- ZONES ---//
// THE BLACK SHROUDS
const OldGridania : Zone = {
    name: "Old Gridania",
    region: TheBlackShrouds,
    markers: [],
}

const NewGridania : Zone = {
    name: "New Gridania",
    region: TheBlackShrouds,
    markers: [],
}

const CentralShroud : Zone = {
    name: "Central Shroud",
    region: TheBlackShrouds,
    markers: [],
}

const NorthShroud : Zone = {
    name: "North Shroud",
    region: TheBlackShrouds,
    markers: [],
}

const SouthShroud : Zone = {
    name: "South Shroud",
    region: TheBlackShrouds,
    markers: [],
}

const EastShroud : Zone = {
    name: "East Shroud",
    region: TheBlackShrouds,
    markers: [],
}

/* const TheLavenderBeds : Zone = {
    name: "The Lavender Beds",
    region: TheBlackShrouds,
    markers: [],
} */

// THANALAN
const UldahStepsOfNald : Zone = {
    name: "Ul'dah - Steps of Nald",
    region: Thanalan,
    markers: [],
}

const UldahStepsOfThal : Zone = {
    name: "Ul'dah - Steps of Thal",
    region: Thanalan,
    markers: [],
}

const EasternThanalan : Zone = {
    name: "Eastern Thanalan",
    region: Thanalan,
    markers: [],
}

const NorthernThanalan : Zone = {
    name: "Northern Thanalan",
    region: Thanalan,
    markers: [],
}

const SouthernThanalan : Zone = {
    name: "Southern Thanalan",
    region: Thanalan,
    markers: [],
}

const WesternThanalan : Zone = {
    name: "Western Thanalan",
    region: Thanalan,
    markers: [],
}

const CentralThanalan : Zone = {
    name: "Central Thanalan",
    region: Thanalan,
    markers: [],
}

// LA NOSCEA
const LimsaLominsaUpperDecks : Zone = {
    name: "Limsa Lominsa Upper Decks",
    region: LaNoscea,
    markers: [],
}

const LimsaLominsaLowerDecks : Zone = {
    name: "Limsa Lominsa Lower Decks",
    region: LaNoscea,
    markers: [],
}

const OuterLaNoscea : Zone = {
    name: "Outer La Noscea",
    region: LaNoscea,
    markers: [],
}

const UpperLaNoscea : Zone = {
    name: "Upper La Noscea",
    region: LaNoscea,
    markers: [],
}

const WesternLaNoscea : Zone = {
    name: "Western La Noscea",
    region: LaNoscea,
    markers: [],
}

const EasternLaNoscea : Zone = {
    name: "Eastern La Noscea",
    region: LaNoscea,
    markers: [],
}

const LowerLaNoscea : Zone = {
    name: "Lower La Noscea",
    region: LaNoscea,
    markers: [],
}

const MiddleLaNoscea : Zone = {
    name: "Middle La Noscea",
    region: LaNoscea,
    markers: [],
}

// COERTHAS
const CoerthasCentralHighlands : Zone = {
    name: "Coerthas Central Highlands",
    region: Coerthas,
    markers: [],
}

// MOR DHONA
const MorDhonaZ : Zone = {
    name: "Mor Dhona",
    region: MorDhona,
    markers: [],
}

// Add markers to regions and zones
// THE BLACK SHROUDS
TheBlackShrouds.markers.push(
    {target: NewGridania, latLng: [28.0625, -19.4375]},
    {target: OldGridania, latLng: [40.375, -20.875]},
    {target: NorthShroud, latLng: [39.25, -62]},
    {target: CentralShroud, latLng: [0.75, -15.25]},
    {target: SouthShroud, latLng: [-46.5, 9.75]},
    {target: EastShroud, latLng: [38.25, 39.75]},
    /* {target: TheLavenderBeds, latLng: [-4.5, 21]}, */
);

NewGridania.markers.push(
    {target: OldGridania, latLng: [5.5 , -25.5]},
    {target: OldGridania, latLng: [10.5 , 7.25]},
    {target: OldGridania, latLng: [3 , 28.75]},
    {target: CentralShroud, latLng: [-24.25 , -39.25]},
    {target: CentralShroud, latLng: [-37.5 , 52.75]},
);
OldGridania.markers.push(
    {target: NewGridania, latLng: [-1 , -23]},
    {target: NewGridania, latLng: [8.5 , 2.75]},
    {target: NewGridania, latLng: [-3.625 , 21.375]},
    {target: NorthShroud, latLng: [19.78125 , -64.75]},
    /* {target: TheLavenderBeds, latLng: [47.4375 , 66.5]}, */
    {target: EastShroud, latLng: [56.125 , 66.4375]},
);
NorthShroud.markers.push(
    {target: OldGridania, latLng: [-10.25 , 61.25]},
    {target: CentralShroud, latLng: [-69.03125 , 12.625]},
    {target: CoerthasCentralHighlands, latLng: [-4.6875 , -53.625]},
);
CentralShroud.markers.push(
    {target: NorthShroud, latLng: [54.875 , -53.9375]},
    {target: OldGridania, latLng: [45.375 , -29.0625]},
    {target: OldGridania, latLng: [47.9375 , 18.0625]},
    {target: EastShroud, latLng: [33 , 51.28125]},
    {target: SouthShroud, latLng: [-75.84375 , 17.375]},
    /* {target: TheLavenderBeds, latLng: [-35.75, 40.875]}, */
);
SouthShroud.markers.push(
    {target: CentralShroud, latLng: [37.25 , -50.75]},
    {target: EastShroud, latLng: [41.125 , 37.75]},
    {target: EasternThanalan, latLng: [-88 , -37.875]},
);
EastShroud.markers.push(
    {target: OldGridania, latLng: [-8 , -80.375]},
    {target: CentralShroud, latLng: [-47.75 , -56]},
    {target: SouthShroud, latLng: [-65.25 , -15.625]},
);
/* TheLavenderBeds.markers.push(
    {target: CentralShroud, latLng: [-42.75 , 7.625]},
    {target: OldGridania, latLng: [-50.875 , 7.5625]},
); */

// THANALAN
Thanalan.markers.push(
    {target: UldahStepsOfNald, latLng: [-19.75, -12.75]},
    {target: UldahStepsOfThal, latLng: [-27.8125, -10.5]},
    {target: EasternThanalan, latLng: [23.5, 50]},
    {target: NorthernThanalan, latLng: [53, -1.5]},
    {target: SouthernThanalan, latLng: [-60, 33.75]},
    {target: WesternThanalan, latLng: [-5.875, -49.125]},
    {target: CentralThanalan, latLng: [7.75, 0.6875]},
);

UldahStepsOfNald.markers.push(
    {target: UldahStepsOfThal, latLng: [-9, 9]},
    {target: CentralThanalan, latLng: [49.625, 13.75]},
    {target: WesternThanalan, latLng: [2.5, -55.75]},
);
UldahStepsOfThal.markers.push(
    {target: UldahStepsOfNald, latLng: [22, -19]},
    {target: CentralThanalan, latLng: [-14.875, 52.375]},
);
EasternThanalan.markers.push(
    {target: CentralThanalan, latLng: [-42, -77.5]},
    {target: SouthernThanalan, latLng: [-66.75, -11.5]},
    {target: SouthShroud, latLng: [42.9375, 51.5625]},
);
SouthernThanalan.markers.push(
    {target: CentralThanalan, latLng: [54, -59]},
    {target: EasternThanalan, latLng: [89.25, -3.75]},
);
WesternThanalan.markers.push(
    {target: UldahStepsOfNald, latLng: [-18, 68]},
    {target: CentralThanalan, latLng: [14.5, 36]},
    {target: LimsaLominsaLowerDecks, latLng: [33.5, -71.5]},
);
NorthernThanalan.markers.push(
    {target: CentralThanalan, latLng: [-70.75, 0.5]},
    {target: MorDhonaZ, latLng: [50.25, -1.5]},
);
CentralThanalan.markers.push(
    {target: UldahStepsOfNald, latLng: [-50.75, -18.875]},
    {target: UldahStepsOfThal, latLng: [-54.75, -12.75]},
    {target: EasternThanalan, latLng: [30.75, 61.25]},
    {target: SouthernThanalan, latLng: [-80.25, 39]},
    {target: WesternThanalan, latLng: [-19, -57.25]},
    {target: NorthernThanalan, latLng: [68.5, -2]},
);

// NOSCEA
LaNoscea.markers.push(
    {target: LimsaLominsaUpperDecks, latLng: [-33.78125, -2.71875]},
    {target: LimsaLominsaLowerDecks, latLng: [-43.4375, -9.625]},
    {target: UpperLaNoscea, latLng: [40, -1]},
    {target: LowerLaNoscea, latLng: [-65.75, 37.75]},
    {target: WesternLaNoscea, latLng: [20, -42.375]},
    {target: EasternLaNoscea, latLng: [3, 49]},
    {target: OuterLaNoscea, latLng: [65.25, -6.25]},
    {target: MiddleLaNoscea, latLng: [-15, 9]},
);

LimsaLominsaUpperDecks.markers.push(
    {target: LimsaLominsaLowerDecks, latLng: [-4.5625, -15.1875]},
    {target: LowerLaNoscea, latLng: [-55.5, 8]},
);
LimsaLominsaLowerDecks.markers.push(
    {target: LimsaLominsaUpperDecks, latLng: [15.5, -19.25]},
    {target: MiddleLaNoscea, latLng: [0.75, 30.75]},
    {target: EasternLaNoscea, latLng: [-62.75, -52.375]},
    {target: WesternLaNoscea, latLng: [-68.125, -52.875]},
    {target: WesternThanalan, latLng: [-10, -94.8125]},
);
MiddleLaNoscea.markers.push(
    {target: LimsaLominsaLowerDecks, latLng: [-22.25, -18.25]},
    {target: LowerLaNoscea, latLng: [-32.25, 37]},
    {target: EasternLaNoscea, latLng: [85.25, -13]},
    {target: WesternLaNoscea, latLng: [72.75, -51.25]},
);
UpperLaNoscea.markers.push(
    {target: OuterLaNoscea, latLng: [13.5, -28.5]},
    {target: OuterLaNoscea, latLng: [35, 23.5]},
    {target: EasternLaNoscea, latLng: [-40.5, 71.5]},
    {target: WesternLaNoscea, latLng: [-43, -62.5]},
);
LowerLaNoscea.markers.push(
    {target: WesternLaNoscea, latLng: [-92, -21.25]},
    {target: LimsaLominsaUpperDecks, latLng: [-13.5, -21.5]},
    {target: MiddleLaNoscea, latLng: [43.6875, 8.625]},
    {target: EasternLaNoscea, latLng: [69.5, 63]},
    {target: EasternLaNoscea, latLng: [55, 78]},
);
WesternLaNoscea.markers.push(
    {target: UpperLaNoscea, latLng: [16, 42.5]},
    {target: LimsaLominsaLowerDecks, latLng: [-52.875, 25.875]},
    {target: LowerLaNoscea, latLng: [-57, 25.5]},
    {target: MiddleLaNoscea, latLng: [-56.5, 94]},
);
EasternLaNoscea.markers.push(
    {target: UpperLaNoscea, latLng: [24.25, -1.25]},
    {target: LimsaLominsaLowerDecks, latLng: [-40.625, 80.75]},
    {target: MiddleLaNoscea, latLng: [-6.5, -29.5]},
    {target: LowerLaNoscea, latLng: [-102.75, 23.25]},
    {target: LowerLaNoscea, latLng: [-94.75, -14.5]},
);
OuterLaNoscea.markers.push(
    {target: UpperLaNoscea, latLng: [-4, -40]},
    {target: UpperLaNoscea, latLng: [13, 38]},
);

// COERTHAS
Coerthas.markers.push(
    {target: CoerthasCentralHighlands, latLng: [-38, 43]},
);

CoerthasCentralHighlands.markers.push(
    {target: NorthShroud, latLng: [-77, 10]},
    {target: MorDhonaZ, latLng: [-89, -20.5]},
);

// MOR DHONA
MorDhona.markers.push(
    {target: MorDhonaZ, latLng: [2.625, -4.75]},
);

MorDhonaZ.markers.push(
    {target: CoerthasCentralHighlands, latLng: [84.625, 18.875]},
    {target: NorthernThanalan, latLng: [-4.5, -39.5]},
);

TheSource.markers.push(
    {target: LaNoscea, latLng: [-53.862, -181.286]},
    {target: TheBlackShrouds, latLng: [-37.703, -117.562]},
    {target: Thanalan, latLng: [-77.680, -144.018]},
    {target: Coerthas, latLng: [-27.311, -158.287]},
    {target: MorDhona, latLng: [-51.913, -142.524]},
);

//var MapData = [LaNoscea, TheBlackShrouds, Thanalan, Coerthas, MorDhona];


export default TheSource;
export type { Map, Zone }