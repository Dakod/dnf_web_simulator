import *  as xmlReader from "@/js/xmlReader"
import {Serializable} from "@/js/simulator/Serializable";

export class Monster extends Serializable {
    constructor(id) {
        super();
        this.id = id;  //怪物ID
        this.name = "";
        this.level = 0;
        this.defence = 0;
        this.DarkStrengthen = 0;  //其实代表的是抗性 为了取值简单就直接写成属性强化了
        this.LightStrengthen = 0;
        this.IceStrengthen = 0;
        this.FireStrengthen = 0;
        this.resetMonster();
    }

    init() {
        this.resetMonster();
    }

    resetMonster() {
        let monster = xmlReader.getMonsterInfo(this.id);
        this.name = monster.children("Name").text();
        this.level = parseFloat(monster.children("Level").text());
        this.defence = parseFloat(monster.children("Defence").text());
        this.DarkStrengthen = parseFloat(monster.children("DarkStrengthen").text());
        this.LightStrengthen = parseFloat(monster.children("LightStrengthen").text());
        this.IceStrengthen = parseFloat(monster.children("IceStrengthen").text());
        this.FireStrengthen = parseFloat(monster.children("FireStrengthen").text());
    }

    setMonsterId(id) {
        this.id = id;
        this.resetMonster();
    }

}

Serializable.defineNotEnumerableProperty(Monster.prototype, "serializeField", ["id"]);



