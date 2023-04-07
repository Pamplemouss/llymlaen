export function calculateDist(p1: [number, number], p2: [number, number]) {
    return Math.pow((Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[1] - p2[1]), 2)), 0.5);
}

export function invLerp(from: number, to: number, value: number) {
    return (value - from) / (to - from);
}

export function toSnakeCase(name: string) {
    return name.toLowerCase().replaceAll(" ", "_");
}