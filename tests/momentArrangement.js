const MomentArrangement = require("../lib/MomentArrangement");
const MomentContainer = require("../lib/MomentContainer");

let momentArrangement = new MomentArrangement(
  new MomentContainer(1587718105256, 0, "en"),
  "",
  "en"
);
console.log(momentArrangement.formatTime());
