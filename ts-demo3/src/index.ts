import {Man} from "./MyType";


const man:Man=new Man("张三",12);
console.log("Hello TypeScript Node.js",man.age,man.name);


const s="Hello TypeScript Node.js";

let a:number=12;
var b:number=13;
const d:number=14

function add(x:number,y:number):number{
    return x+y;
}

const reduce=(x:number,y:number):number=>{
    return x-y;
}