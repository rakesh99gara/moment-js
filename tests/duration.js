const Duration = require("../lib/Duration");
const Moment = require("../lib/Moment");

let duration = new Duration(24, "hours");
duration.add([2, "weeks"]);
duration.add(2, "weeks");

duration.add(
  new Moment(new Date()).diff(new Moment(new Date(2020, 3, 24, 15)), "days")
);
duration.subtract(2, "weeks");
duration.subtract([2, "weeks"]);
duration.add(24, "hours");

console.log(duration.humanize("days"));
console.log(duration.asMinutes());

console.log(duration.asDays());
