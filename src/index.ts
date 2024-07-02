import { simulation } from "./libs/simulation";
import { disease } from "./libs/disease";
import { randomNum, saveMsg, mkdir } from "./libs/utils";
import { agent } from "./libs/agent";
import { statistics, drawDiagram } from "./libs/statistics";
import type { SimulationOptionsType } from "./libs/simulation";

(global as any).debug = false;

const SIMULATION_OPTION: SimulationOptionsType = {
    timeSpan: 60,
    tickSpeed: 0,
    agentNumber: 40,
    roomSize: 40
}


async function saveReport(report: any){
    const date = new Date();
    const reportName =`report-${date.getFullYear().toString().padEnd(2, "0")}${date.getMonth().toString().padEnd(2, "0")}${date.getDate().toString().padEnd(2, "0")}-${date.getHours().toString().padEnd(2, "0")}${date.getMinutes().toString().padEnd(2, "0")}${date.getSeconds().toString().padEnd(2, "0")}`;
    const resultFilePath = `./reports/${reportName}/result.json`;
    const diagramPath = `./reports/${reportName}/diagram.png`;
    
    await mkdir("./reports");
    await mkdir(`./reports/${reportName}`);
    await saveMsg(JSON.stringify(report, null, 4), resultFilePath)
    console.log(`Finish simulation, save report to ${resultFilePath}`);
    console.log("Drawing diagram with data");
    drawDiagram(resultFilePath, diagramPath);
    console.log(`Finish drawing diagram, save diagram to ${diagramPath}`);
}

function startSimulation(){
    const simulationDisease = new disease("Cold", 10, 100);
    const routine = (time: number, roomSize: number, agent: agent) => {
        const x = randomNum(roomSize-1, 0);
        const y = randomNum(roomSize-1, 0);
        return { x, y };
    }
    const simulationClass = new simulation(simulationDisease, routine, SIMULATION_OPTION);
    const statisticsClass = new statistics(simulationClass);
    simulationClass.addHandler("tick", (simulationStep: simulation) => {
        const infectedAgentNum = simulationStep.agents.filter((agent) => agent.infected).length;
        const susceptibleAgentNum = simulationStep.agents.filter((agent) => !agent.infected && !agent.previouslyInfected).length;
        const recoveredAgentNum = simulationStep.agents.filter((agent) => agent.previouslyInfected && agent.timeToRestore === 0).length;
        statisticsClass.addRecord(simulationStep.time, infectedAgentNum, susceptibleAgentNum, recoveredAgentNum);
    });
    simulationClass.addHandler("finish", () => {
        const report = statisticsClass.generateReport();
        saveReport(report);
    });
    simulationClass.startTime();
}


startSimulation()
