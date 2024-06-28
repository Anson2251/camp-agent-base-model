export function randomNum(max: number, min: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randomBool() {
    return Math.random() < 0.5;
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}