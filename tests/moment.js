const Moment = require("../lib/Moment");

let moment = new Moment("2020 4 24T2:18:25.256 pm", "YYYY M DTh:m:s.SSS a");
console.log(moment.fromNow());
console.log(moment.diff(new Moment(new Date(2020, 2, 1, 3, 34)), "days"));
// console.log(moment.diff(new Moment(new Date(2020, 1, 26, 3, 34)), "hours"));
console.log(moment.Format("hh-mm-ss.SSS a"));
console.log(moment.Format("hh-mm-ss.SSS a ZZ"));
console.log(moment.Format("h/mm/ss.SSS A"));
console.log(moment.Format("Do MMMM Y h A"));

let a = new Moment(new Date(2000, 2, 26, 13, 15, 15, 400));
console.log(a.Format("hh-mm-ss.SSS a"));
console.log(a.Format());
console.log(a.Format("l"));

let b = new Moment("3 2", "W E");
console.log(b.Format("Do MMM Y"));

let c = new Moment("1582527929", "X");
console.log(c.Format("X"));

let d = new Moment("September 12 2019", "MMMM D Y");
console.log(d.Format("M"));

//comparing
console.log(d.from(b));
console.log(a.from(moment));

let f = new Moment("This is September 32 2020", "MMMM D Y", false, "hi");

console.log(f.Format("M"));

console.log(new Moment(new Date(2020, 0, 23)).asString());

console.log(b.isBefore(moment, "days"));

console.log(moment.isLeapYear()); //2020

console.log(moment.toISOString());

console.log(moment.Format("x"));
