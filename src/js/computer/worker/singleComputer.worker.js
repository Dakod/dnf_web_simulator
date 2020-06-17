import {SingleScoreComputer} from "@/js/computer/SingleScoreComputer";


onmessage = function (event) {
    const data = event.data;
    const singleScoreComputer = new SingleScoreComputer(data.xmlData, data.roleBase, data.equipmentList, data.heapSize, data.start, data.end);
    singleScoreComputer.startCompute();
    postMessage({
        msg: "heap",
        heap: singleScoreComputer.scoreHeap
    });
    self.close();
}