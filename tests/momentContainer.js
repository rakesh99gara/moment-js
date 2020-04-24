const MomentContainer = require("../lib/MomentContainer");

let momentContainer = new MomentContainer(1587718105256, 0, "tel");
console.log(momentContainer.moment["MMMM"]);
