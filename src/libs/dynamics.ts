import { room } from "./environment";
import { disease } from "./disease";
import * as utils from "./utils";

function getPossibilityOfInfected(distance: number) {
    return Math.round((distance <= 1 ? 1 : (1 / (distance**2)))*10)/10;
}


export class dynamics {
    room: room;
    disease: disease | undefined;
    possibilityMap: number[][];
    constructor(room: room) {
        this.room = room;
        this.possibilityMap = new Array(this.room.size).fill(0).map(() => new Array(this.room.size).fill(0));
    }

    getInfectionMap(){ // 1: infected, 0: not infected
        const map = new Array(this.room.size).fill(0).map(() => new Array(this.room.size).fill(0));
        this.room.agents.forEach(agent => {
            if(agent.infected && !agent.mask){
                const {x, y} = agent.location;
                this.disease = agent.record[agent.record.length - 1].disease;
                map[x][y] = 1;
            }
        });
        return map;
    }

    updateInfectionPossibilityMap(): void{
        this.possibilityMap = new Array(this.room.size).fill(0).map(() => new Array(this.room.size).fill(0));
        const infectionMap = this.getInfectionMap();

        for(let ii = 0; ii < this.room.size; ii++){
            for(let ij = 0; ij < this.room.size; ij++){
                if(infectionMap[ii][ij] === 1){
                    for(let i = 0; i < this.room.size; i++){
                        for(let j = 0; j < this.room.size; j++){
                            const distance = utils.distance(ii, ij, i, j);
                            const possibility = getPossibilityOfInfected(distance);
                            this.possibilityMap[i][j] = this.possibilityMap[i][j] + possibility < 1 ? this.possibilityMap[i][j] + possibility : 1;
                        }
                    }
                }
            }
        }
    }

    applyDynamics(){
        this.updateInfectionPossibilityMap();

        this.room.agents.filter(agent => !agent.infected && agent.previouslyInfected === false && !agent.mask).forEach(agent => {
            const {x, y} = agent.location;

            if(this.possibilityMap[x][y] === 0) return;
            const randNum = Math.random();
            if(randNum < this.possibilityMap[x][y]){
                agent.getInfected(this.room.time, this.disease!);
            }
        })
    }
}
