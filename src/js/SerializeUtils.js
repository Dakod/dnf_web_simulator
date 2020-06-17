// const MAGIC = "CAFEBABE";
const DB_NAME = "SIMULATOR_DAROD";
const tableList = ["role", "template", "collection"];
export const VERSION = "1.3.0";

export function saveFile(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export class SerializeUtils {
    constructor() {
        this.openDBPromise = new Promise((resolve, reject) => {
            let request = window.indexedDB.open(DB_NAME);
            request.onerror = () => {
                console.log('数据库打开报错');
                reject(new Error("数据库打开报错"));
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                let db = event.target.result;
                for (let table of tableList) {
                    if (!db.objectStoreNames.contains(table)) {
                        db.createObjectStore(table, {autoIncrement: true});
                    }
                }
            }
        });
    }

    get(tableName, key) {
        return new Promise((resolve, reject) => {
            this.openDBPromise.then(() => {
                let request = this.db.transaction([tableName])
                    .objectStore(tableName)
                    .get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = (e) => reject(e);
            });
        });
    }

    write(tableName, data, key) {
        return new Promise((resolve, reject) => {
            this.openDBPromise.then(() => {
                let request = this.db.transaction([tableName], 'readwrite')
                    .objectStore(tableName)
                    .add(data, key);
                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (event) => {
                    reject(event);
                }
            });
        });
    }

    delete(tableName, key) {
        return new Promise((resolve, reject) => {
            this.openDBPromise.then(() => {
                let request = this.db.transaction([tableName], 'readwrite')
                    .objectStore(tableName)
                    .delete(key);
                request.onsuccess = () => resolve();
                request.onerror = (e) => reject(e);
            });
        });
    }

    update(tableName, data, key) {
        return new Promise((resolve, reject) => {
            this.openDBPromise.then(() => {
                let request = this.db.transaction([tableName], 'readwrite')
                    .objectStore(tableName)
                    .put(data, data.key || key);
                request.onsuccess = () => resolve();
                request.onerror = (e) => reject(e);
            });
        });
    }

    readAll(tableName, isResultMap) {
        return new Promise((resolve) => {
            this.openDBPromise.then(() => {
                let resultList = [];
                let resultMap = {};
                let objectStore = this.db.transaction(tableName).objectStore(tableName);
                let cursorObject = objectStore.openCursor();
                cursorObject.onsuccess = (event) => {
                    let cursor = event.target.result;
                    if (cursor) {
                        if (isResultMap) {
                            resultMap[cursor.key] = cursor.value;
                        } else {
                            cursor.value.key = cursor.key;
                            resultList.push(cursor.value);
                        }
                        cursor.continue();
                    } else {
                        if (isResultMap)
                            resolve(resultMap);
                        else
                            resolve(resultList);
                    }
                };
                // cursorObject.onerror(event => {
                //     reject(event);
                // })
            })
        });
    }

}

const serializeUtils = new SerializeUtils();
export {serializeUtils};

// export function generateUUID() {
//     let d = new Date().getTime();
//     if (window.performance && typeof window.performance.now === "function") {
//         d += performance.now();
//     }
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         let r = (d + Math.random() * 16) % 16 | 0;
//         d = Math.floor(d / 16);
//         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//     });
// }
//
// function getUUID() {
//     let uuid = "";
//     do {
//         uuid = generateUUID();
//     } while (window.localStorage.getItem(uuid));
//     return uuid;
// }


