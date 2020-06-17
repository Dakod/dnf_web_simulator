export class Timer {
    constructor(name) {
        this.name = name;
    }

    start() {
        this.startTime = new Date();
    }

    end() {
        const endTime = new Date();
        const time = endTime - this.startTime;
        const totalSeconds = parseInt(time / 1000);
        const mSeconds = time % 1000;
        const seconds = parseInt(totalSeconds % 60);
        const minus = parseInt(totalSeconds / (60));
        const hours = parseInt(totalSeconds / (60 * 60));
        console.log(this.name + "完成!用时:" + hours + "时" + minus + "分" + seconds + "秒" + mSeconds + "毫秒");
    }
}
