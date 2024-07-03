import { simulation } from "./libs/simulation";
import { disease } from "./libs/disease";
import { randomNum } from "./libs/utils";
import { agent } from "./libs/agent";
import { statistics } from "./libs/statistics";
import type { SimulationOptionsType } from "./libs/simulation";

(global as any).debug = false;

const SIMULATION_OPTION: SimulationOptionsType = {
    timeSpan: 60,
    tickSpeed: 0,
    agentNumber: 40,
    roomSize: 40
}

function startSimulation(){
    const simulationDisease = new disease("Cold", 10, 100);
    const routine = (time: number, roomSize: number, agent: agent) => {
        const x = randomNum(roomSize-1, 0);
        const y = randomNum(roomSize-1, 0);
        return { x, y };
    }
    const simulationClass = new simulation(simulationDisease, routine, SIMULATION_OPTION);
    new statistics(simulationClass);
    simulationClass.startTime();
}


startSimulation()
