import { room } from "./environment";
import { disease } from "./disease";
import * as utils from "./utils";

function getPossibilityOfInfected(distance: number) {
    return Math.round((1 / distance === 0 ? 1 : 0.9 / distance)*10)/10;
}


export class dynamics {
    room: room;
    disease: disease | undefined;
    constructor(room: room) {
        this.room = room;
    }

    getInfectionMap(){ // 1: infected, 0: not infected
        const map = new Array(this.room.size).fill(0).map(() => new Array(this.room.size).fill(0));
        this.room.agents.forEach(agent => {
            if(agent.timeToRestore > 0) {
                const {x, y} = agent.location;
                this.disease = agent.record[agent.record.length - 1].disease;
                map[x][y] = 1;
            }
        });
        return map;
    }

    getInfectionPossibilityMap(){
        const map = new Array(this.room.size).fill(0).map(() => new Array(this.room.size).fill(0));
        const infectionMap = this.getInfectionMap();

        for(let ii = 0; ii < this.room.size; ii++){
            for(let ij = 0; ij < this.room.size; ij++){
                if(infectionMap[ii][ij] === 1){
                    for(let i = 0; i < this.room.size; i++){
                        for(let j = 0; j < this.room.size; j++){
                            const distance = utils.distance(ii, ij, i, j);
                            const possibility = getPossibilityOfInfected(distance);
                            map[i][j] = map[i][j] + possibility < 1 ? map[i][j] + possibility : 1;
                        }
                    }
                }
            }
        }

        return map;
    }

    applyInfectionPossibilityCalc(x: number, y: number){
        for(let i = 0; i < this.room.size; i++){
            for(let j = 0; j < this.room.size; j++){
                const distance = utils.distance(x, y, i, j);
                const possibility = getPossibilityOfInfected(distance);
            }
        }
    }

    applyDynamics(){
        // const infectionMap = this.getInfectionMap();
        const infectionPossibilityMap = this.getInfectionPossibilityMap();
        console.log(infectionPossibilityMap.map((r) => (r.map((n) => n.toString().slice(0, 3))).join(" ")).join("\n"));
        this.room.agents.forEach(agent => {
            const {x, y} = agent.location;
            const randomNumber = utils.randomNum(0, 100 / infectionPossibilityMap[x][y]);
            if(randomNumber <= 100 && agent.timeToRestore === 0 && agent.infected === false) {
                agent.getInfected(this.room.time, this.disease!);
            }
        })
    }
}
