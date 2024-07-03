import { simulation } from "./simulation";
import { exec } from "node:child_process";
import { mkdir, saveMsg } from "./utils";
import { disease } from "./disease";

interface recordType {
    time: number
    infectedAgentNum: number
    susceptibleAgentNum: number
    recoveredAgentNum: number
}

export class statistics {
    records: recordType[] = []
    simulationClass: simulation
    constructor(simulationClass: simulation) {
        this.simulationClass = simulationClass;
        simulationClass.addHandler("tick", (simulationStep: simulation) => {
            const infectedAgentNum = simulationStep.agents.filter((agent) => agent.infected).length;
            const susceptibleAgentNum = simulationStep.agents.filter((agent) => !agent.infected && !agent.previouslyInfected).length;
            const recoveredAgentNum = simulationStep.agents.filter((agent) => agent.previouslyInfected && agent.timeToRestore === 0).length;
            this.addRecord(simulationStep.time, infectedAgentNum, susceptibleAgentNum, recoveredAgentNum);
        });
        simulationClass.addHandler("finish", () => {
            const report = this.generateReport();
            saveReport(report);
        });
    }

    addRecord(time: number, infectedAgentNum: number, susceptibleAgentNum: number, recoveredAgentNum: number) {
        this.records.push({
            time: time,
            infectedAgentNum: infectedAgentNum,
            susceptibleAgentNum: susceptibleAgentNum,
            recoveredAgentNum: recoveredAgentNum
        })
    }

    generateReport() {
        const report: Record<string, any> = {};
        report.data = {};
        this.records.forEach(record => {
            report.data[String(record.time)] = {
                infectedAgentNum: record.infectedAgentNum,
                susceptibleAgentNum: record.susceptibleAgentNum,
                recoveredAgentNum: record.recoveredAgentNum
            }
        });
        report.meta = {
            timeSpan: this.simulationClass.timeSpan,
            agentNumber: this.simulationClass.agentNumber,
            roomSize: this.simulationClass.roomSize,
            disease: {
                instanceUUID: this.simulationClass.dynamics.disease?.id,
                name: this.simulationClass.dynamics.disease?.name,
                severity: this.simulationClass.dynamics.disease?.seriousness,
                timeToRestore: this.simulationClass.dynamics.disease?.timeToRestore
            }
        }
        return report;
    }
}

export async function drawDiagram(dataPath: string, diagramPath: string){
    exec(`Rscript ./src/libs/plot-graph.r ${dataPath} ${diagramPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: \n\n${error.message}`);
          return Promise.reject(error);
        }
        if (stderr) {
          console.error(`Error/Warning message generated by the script: \n${stderr.trim().split("\n").map(s => "  " + s).join("\n")}`);
          return Promise.resolve(stderr);
        }
        return Promise.resolve(`Script output: ${stdout}`);
    });
}

export async function saveReport(report: any){
    const date = new Date();
    const reportName =`report-${date.getFullYear().toString().padEnd(2, "0")}${date.getMonth().toString().padEnd(2, "0")}${date.getDate().toString().padEnd(2, "0")}-${date.getHours().toString().padEnd(2, "0")}${date.getMinutes().toString().padEnd(2, "0")}${date.getSeconds().toString().padEnd(2, "0")}`;
    const resultFilePath = `./reports/${reportName}/result.json`;
    const diagramPath = `./reports/${reportName}/diagram.png`;

    await mkdir("./reports");
    await mkdir(`./reports/${reportName}`);
    await saveMsg(JSON.stringify(report, null, 4) + "\n"/* solve the warning in R (incomplete line) */, resultFilePath)
    console.log(`Finish simulation, save report to ${resultFilePath}`);
    console.log("Drawing diagram with data");
    await drawDiagram(resultFilePath, diagramPath);
    console.log(`Finish drawing diagram, save diagram to ${diagramPath}`);
}
