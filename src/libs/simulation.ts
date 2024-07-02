import { agent } from "./agent";
import { disease } from "./disease";
import { room } from "./environment";
import { dynamics } from "./dynamics";
import { randomNum, randomBool } from "./utils";

// const TIME_SPAN = 30;
// const TICK_SPEED = 0;
// const AGENT_NUM = 20;
// const ROOM_SIZE = 15;

interface simulationHandlerType {
    type: string,
    handler: (...args: any) => any
}

export interface SimulationOptionsType {
    timeSpan: number,
    tickSpeed: number,
    agentNumber: number,
    roomSize: number,
}

export class simulation {
    dynamics: dynamics;
    room: room;
    agents: agent[] = [];
    time: number = 0;
    handlers: simulationHandlerType[] = [];
    timeUpdater: any;

    timeSpan: number;
    tickSpeed: number;
    agentNumber: number;
    roomSize: number;

    constructor(disease: disease, routine: (time: number, roomSize: number, agent: agent) => { x: number, y: number }, options: SimulationOptionsType) {
        this.room = new room(options.roomSize);
        this.dynamics = new dynamics(this.room);
        this.dynamics.disease = disease;

        this.timeSpan = options.timeSpan;
        this.tickSpeed = options.tickSpeed;
        this.agentNumber = options.agentNumber;
        this.roomSize = options.roomSize;

        console.log("Start preparation\n");
        console.log("  Disease: " + disease.name);
        console.log("    Severity: " + disease.seriousness);
        console.log("    Time to recover: " + disease.timeToRestore);
        console.log("  Room size: " + this.roomSize);
        console.log("  Time span: " + this.timeSpan);
        console.log("  Agent number: " + this.agentNumber);

        for(let i = 0; i < this.agentNumber-1; i++){
            this.agents.push(new agent(routine, {
                age: randomNum(100, 0),
                gender: randomBool() ? "M" : "F",
                mask: false,//randomBool(),
                health: 100,
            }))
        }

        const infectedAgent = new agent(routine, {
            age: randomNum(100, 0),
            gender: randomBool() ? "M" : "F",
            mask: false, //randomBool(),
            health: 100,
        });
        infectedAgent.updateTime(0, this.roomSize);
        infectedAgent.getInfected(0, disease);
        this.agents.push(infectedAgent);

        this.agents.forEach(agent => this.room.addAgent(agent));

        console.log("\nFinish preparation.");
    }

    startTime(){
        this.time = 0;

        console.log("Start simulation");
        this.timeUpdater = setInterval(() => {
            this.time += 1;
            if((global as any).debug) console.log(`\n------\nTime: ${this.time}/${this.timeSpan}`);

            this.room.setTime(this.time);
            this.dynamics.applyDynamics();

            let infectedAgentNum = this.room.agents.filter((agent) => agent.timeToRestore > 0).length;

            if((global as any).debug) console.log(`Infected agents: ${infectedAgentNum}/${this.agentNumber}`);

            if((global as any).debug) console.log("Infection possibility map: ");
            if((global as any).debug) console.log(this.dynamics.possibilityMap.map((r) => (r.map((n) => (n.toString() as string).slice(0, 3).padEnd(3, " "))).join(", ")).join("\n"));
            this.triggerHandler("tick");

            if(this.time >= this.timeSpan){
                clearInterval(this.timeUpdater!);
                if((global as any).debug) console.log("Finish time: " + this.time);
                this.triggerHandler("finish");
            }
        }, this.tickSpeed * 1000);
    }

    addHandler(type: string, handler: (...args: any) => any){
        this.handlers.push({type, handler});
    }

    triggerHandler(type: string): void {
        this.handlers.filter(h => h.type === type).forEach(h => h.handler(this))
    }
}
