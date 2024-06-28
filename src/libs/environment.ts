import { agent } from "./agent";

export class room {
    time: number;
    readonly size: number
    agents: agent[] = [];
    constructor(size: number) {
        this.time = 0;
        this.size = size;
    }

    updateTime(){
        this.time += 1;
        this.agents.forEach(agent => agent.updateTime(this.time, this.size));
    }

    hasAgent(id: string){
        return this.agents.some(agent => agent.id === id);
    }

    addAgent(agent: agent) {
        if(this.hasAgent(agent.id)) {
            return;
        }
        this.agents.push(agent);
    }

    setTime(time: number){
        this.time = time;
        this.updateTime();
    }
}