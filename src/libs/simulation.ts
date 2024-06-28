import { agent } from "./agent";
import { disease } from "./disease";
import { room } from "./environment";
import { dynamics } from "./dynamics";
import { randomNum, randomBool } from "./utils";

const TIME_SPAN = 100;
const TICK_SPEED = 0;
const AGENT_NUM = 10;
const ROOM_SIZE = 10;

export class simulation {
    dynamics: dynamics;
    room: room;
    agents: agent[] = [];
    time: number = 0;
    timeUpdater: number | undefined
    constructor(disease: disease, routine: (time: number, roomSize: number) => { x: number, y: number }) {
        this.room = new room(ROOM_SIZE);

        this.dynamics = new dynamics(this.room);
        this.dynamics.disease = disease;

        for(let i = 0; i < AGENT_NUM-1; i++){
            this.agents.push(new agent(routine, {
                age: randomNum(100, 0),
                gender: randomBool() ? "M" : "F",
                mask: randomBool(),
                health: 100,
            }))
        }

        const infectedAgent = new agent(routine, {
            age: randomNum(100, 0),
            gender: randomBool() ? "M" : "F",
            mask: randomBool(),
            health: 100,
        })
        infectedAgent.getInfected(0, disease);
        this.agents.push(infectedAgent);

        this.agents.forEach(agent => this.room.addAgent(agent));

        console.log("Finish preparation. Simulation start");
    }

    startTime(){
        this.time = 0;

        console.log("Start simulation");
        this.timeUpdater = setInterval(() => {
            this.time += 1;
            console.log("Time: " + this.time);

            this.room.setTime(this.time);
            this.dynamics.applyDynamics();

            if(this.time >= TIME_SPAN){
                clearInterval(this.timeUpdater!);
                console.log("Finish time: " + this.time);
            }
        }, TICK_SPEED * 1000);
    }
}