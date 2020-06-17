import {SuitComputerStarter} from "@/js/computer/SuitComputerStarter";


onmessage = function (event) {
    const suitComputerStarter = new SuitComputerStarter(event.data.xmlData);
    const vectors = suitComputerStarter.startComputerSuitVectors({
        equipmentList: event.data.equipmentList,
    });
    postMessage({
        msg: "vectors",
        vectors: vectors
    });
    self.close();
}