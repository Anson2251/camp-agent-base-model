import { v4 as uuid } from "uuid";
import { disease } from "./disease";
import { room } from "./environment";

type AgentPropertiesType = {
    age: number,
    gender: "F" | "M",
    mask: boolean,
    health: number,
}

type AgentRoutineType = (time: number, roomSize: number, agent: agent) => { x: number, y: number }
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
    infected = false;
    previouslyInfected: boolean = false;
    constructor(routine: AgentRoutineType, options: AgentPropertiesType) {
        this.id = uuid();
        this.age = options.age;
        this.gender = options.gender;
        this.mask = options.mask;
        this.health = options.health;
        this.routine = routine;
        this.activity = 100;

        if((global as any).debug) console.log(`Agent ${this.id} is created`);
        if((global as any).debug) console.log(`  Age: ${this.age}, Gender: ${this.gender}, Mask: ${this.mask}`);
    }

    updateTime(time: number, roomSize: number) {
        if(this.timeToRestore > 0) {
            this.timeToRestore -= 1;
            if(this.timeToRestore === 0) {
                if((global as any).debug) console.log(`Agent ${this.id} is recovered`);
            }
            if(this.timeToRestore === 0) {
                this.activity = 100;
                this.infected = false;
            }
        }
        if(this.activity > 0) {
            this.activity += 1;
        }

        this.location = this.routine(time, roomSize, this);
    }

    getInfected(time: number, disease: disease) {
        this.timeToRestore = disease.timeToRestore;
        this.activity -= disease.seriousness / (100 / this.health);

        if((global as any).debug) console.log(`Agent ${this.id} is infected by '${disease.name}'`);

        this.previouslyInfected = true;
        this.infected = true;
        this.record.push({
            msg: `Infected by ${disease.name}`,
            time: time,
            disease
        });
    }
}