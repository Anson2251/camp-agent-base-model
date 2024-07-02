import { simulation } from "./simulation";
import { exec } from "node:child_process";

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
        }
        return report;
    }
}

export async function drawDiagram(dataPath: string, diagramPath: string){
    exec(`Rscript ./src/libs/plot-graph.r ${dataPath} ${diagramPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          return Promise.reject(error);
        }
        if (stderr) {
          console.error(`Error output: ${stderr}`);
          return Promise.resolve(stderr);
        }
        return Promise.resolve(`Script output: ${stdout}`);
    });
}
