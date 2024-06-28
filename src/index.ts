import { simulation } from "./libs/simulation";
import { disease } from "./libs/disease";
import { randomNum } from "./libs/utils";

function startSimulation(){
    const simulationDisease = new disease("Cold", 10, 100);
    const routine = (time: number, roomSize: number) => {
        const x = randomNum(roomSize, 0);
        const y = randomNum(roomSize, 0);
        return { x, y };
    }
    const simulationClass = new simulation(simulationDisease, routine);
    console.log("1")
    simulationClass.startTime();
}

startSimulation()