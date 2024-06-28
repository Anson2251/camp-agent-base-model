import { agent } from "./agent";
import { disease } from "./disease";
import { room } from "./environment";
import { dynamics } from "./dynamics";
import { randomNum, randomBool } from "./utils";

const TIME_SPAN = 100;
const TICK_SPEED = 0.1;
const AGENT_NUM = 10;
const ROOM_SIZE = 10;

export class simulation {
    dynamics: dynamics;
    room: room;
    agents: agent[] = [];
    time: number = 0;
    constructor(disease: disease, routine: (time: number, roomSize: number) => { x: number, y: number }) {
        this.room = new room(ROOM_SIZE);

        this.dynamics = new dynamics(this.room);
        this.dynamics.disease = disease;

        for(let i = 0; i < AGENT_NUM; i++){
            this.agents.push(new agent(routine, {
                age: randomNum(100, 0),
                gender: randomBool() ? "M" : "F",
                mask: randomBool(),
                health: 100,
            }))
        }
    }

    startTime(){
        this.time = 0;
        this.room.setTime(0);

        setInterval(() => {
            this.time += 1;
            this.room.setTime(this.time);
            this.dynamics.applyDynamics();
            this.agents.forEach(agent => {
                agent.updateTime(this.time, this.room.size);
            });
        }, TICK_SPEED);
    }
}