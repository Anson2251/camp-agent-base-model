import fs from 'node:fs';

export function randomNum(max: number, min: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randomBool() {
    return Math.random() < 0.5;
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function mkdir(path: string){
    return fs.promises.mkdir(path, { recursive: true });
}

export function saveMsg(msg: string, path: string){
    return fs.promises.writeFile(path, msg);
}
