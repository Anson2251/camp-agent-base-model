import { v4 as uuid } from "uuid";

export class disease {
    timeToRestore: number;
    seriousness: number; // 0-100
    name: string;
    id: string;
    constructor(name: string, timeToRestore: number, seriousness: number) {
        this.seriousness = seriousness;
        this.id = uuid();
        this.name = name;
        this.timeToRestore = timeToRestore;
    }
}