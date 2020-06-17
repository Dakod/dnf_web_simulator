import {SuitScoreComputer} from "@/js/computer/SuitScoreComputer";


onmessage = function (event) {
    const data = event.data;
    const suitScoreComputer = new SuitScoreComputer(data.xmlData, data.roleBase, data.equipmentList, data.heapSize, data.vectors);
    suitScoreComputer.startCompute();
    postMessage({
        msg: "heap",
        heap: suitScoreComputer.scoreHeap
    });
    self.close();
}