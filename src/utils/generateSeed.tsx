export default function generateSeed(): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const segmentLength = 4;
    const totalSegments = 3;
    let result = '';

    for (let i = 0; i < totalSegments; i++) {
        let segment = '';
        for (let j = 0; j < segmentLength; j++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            segment += characters[randomIndex];
        }
        result += segment;
        if (i < totalSegments - 1) {
            result += '-';
        }
    }

    return result;
}