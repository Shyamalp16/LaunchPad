"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
function generate() {
    const length = 5;
    let res = "";
    const chr = "123456789qwertyuiopasdfghjklzxcvbnm";
    for (let i = 0; i < length; i++) {
        res += chr[Math.floor(Math.random() * chr.length)];
    }
    return res;
}
exports.generate = generate;
