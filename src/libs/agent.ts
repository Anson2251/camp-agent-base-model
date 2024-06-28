import { v4 as uuid } from "uuid";
import { disease } from "./disease";
import { room } from "./environment";

type AgentPropertiesType = {
    age: number,
    gender: "F" | "M",
    mask: boolean,
    health: number,
}

type AgentRoutineType = (time: number, roomSize: number) => { x: number, y: number }
type AgentRecordType = {
    msg: string,
    time: number,
    disease: disease | undefined,
}

export class agent {
    activity: number; // 0-100
    readonly id: string;
    readonly age: number;
    readonly gender: "F" | "M";
    readonly mask: boolean;
    readonly health: number; // 0 - 100
    timeToRestore: number = 0;
    routine: AgentRoutineType;
    readonly record: AgentRecordType[] = [];
    location: { x: number, y: number } = { x: 0, y: 0 };
    constructor(routine: AgentRoutineType, options: AgentPropertiesType) {
        this.id = uuid();
        this.age = options.age;
        this.gender = options.gender;
        this.mask = options.mask;
        this.health = options.health;
        this.routine = routine;
        this.activity = 100;
    }

    updateTime(time: number, roomSize: number) {
        if(this.timeToRestore > 0) {
            this.timeToRestore -= 1;
            if(this.timeToRestore === 0) {
                this.activity = 100;
            }
        }
        if(this.activity > 0) {
            this.activity -= 1;
        }

        this.location = this.routine(time, roomSize);
    }

    getInfected(time: number, disease: disease) {
        this.timeToRestore = disease.timeToRestore;
        this.activity -= disease.seriousness / (100 / this.health);

        console.log(`Agent ${this.id} is infected by ${disease.name}`);

        this.record.push({
            msg: `Infected by ${disease.name}`,
            time: time,
            disease
        });
    }
}