
export class Serializable {
    constructor() {
        // this.serializeField = serializeField;
    }

    init() {
    }

    parse(object) {
        if (this.serializeClass['all'] !== undefined && this.serializeClass['all'] !== Serializable) {
            for (let property in object) {
                let newSerializeObject = new this.serializeClass['all'];
                newSerializeObject.parse(object[property]);
                this[property] = newSerializeObject;
            }
        } else {
            for (let field of this.serializeField) {
                if (this.serializeClass !== undefined && this.serializeClass[field] !== undefined && object[field] !== undefined) {
                    let newSerializeObject = new this.serializeClass[field];
                    newSerializeObject.parse(object[field]);
                    this[field] = newSerializeObject;
                } else {
                    this[field] = object[field];
                }
            }
        }
        this.init();
    }

    customToJson(filter) {
        let _this = this;
        return JSON.stringify(_this, function (key, value) {
            if (key === "") return value;
            if(this !== _this)return value;
            if ((_this.serializeField !== undefined && _this.serializeField.indexOf(key) > -1) || _this.serializeField.length === 0) { //需要序列化的key
                if(filter && !filter(key))return undefined;
                if (value instanceof Serializable) {
                    return JSON.parse(value.customToJson());
                } else
                    return value;
            }
            return undefined;
        });
    }

    static defineNotEnumerableProperty(object, property, value) {
        Object.defineProperties(object, {
            [property]: {
                enumerable: false,
                configurable: true,
                writable: true,
                value: value
            }
        });
    }
}


Serializable.defineNotEnumerableProperty(Serializable.prototype, "serializeClass", {"all": Serializable});
Serializable.defineNotEnumerableProperty(Serializable.prototype, "serializeField", []);

