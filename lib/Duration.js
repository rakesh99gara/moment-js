class Duration {
  constructor(time, units) {
    this.time = time;
    this.units = units;
    this.parseTime();
  }

  parseTime() {
    this.timeStamp = 0;
    if (this.time.constructor === [].constructor) {
      this.timeStamp +=
        this.convertToType(this.time[0], this.time[1], "seconds") * 1000;
    } else {
      this.timeStamp +=
        this.convertToType(this.time, this.units, "seconds") * 1000;
    }
  }

  convertToType(val, type1, type2, terminate) {
    let divideBy = {
      seconds: 1000,
      minutes: 1000 * 60,
      hours: 1000 * 60 * 60,
      days: 1000 * 60 * 60 * 24,
      weeks: 1000 * 60 * 60 * 24 * 7,
    };

    if (terminate) {
      return Math.floor((val * divideBy[type1]) / divideBy[type2]);
    }

    return (val * divideBy[type1]) / divideBy[type2];
  }

  humanize(units) {
    let prefix = Math.abs(
      this.convertToType(Math.ceil(this.timeStamp / 1000), "seconds", units)
    );
    if (prefix == 1 && units == "hours") {
      prefix = "an";
    }
    if (prefix == 1 && units != "hours") {
      prefix = "a";
    }

    let body = ""
    if (prefix == "an" || prefix == "a") {
      body = units.substring(0, units.length - 1);
    } else {
      body = units;
    }

    let suffix = this.timeStamp < 0 ? " ago" : "";

    return prefix + " " + body + suffix;
  }

  asMilliseconds() {
    return this.timeStamp;
  }

  asMinutes() {
    return this.convertToType(
      Math.ceil(this.timeStamp / 1000),
      "seconds",
      "minutes"
    );
  }

  asSeconds() {
    return Math.ceil(this.timeStamp / 1000);
  }

  asHours() {
    return this.convertToType(
      Math.ceil(this.timeStamp / 1000),
      "seconds",
      "hours"
    );
  }

  asDays() {
    return this.convertToType(
      Math.ceil(this.timeStamp / 1000),
      "seconds",
      "days"
    );
  }

  asWeeks() {
    return this.convertToType(
      Math.ceil(this.timeStamp / 1000),
      "seconds",
      "weeks"
    );
  }

  as(units) {
    if (units == "milliseconds") {
      return this.timeStamp;
    }
    return this.convertToType(
      Math.ceil(this.timeStamp / 1000),
      "seconds",
      units
    );
  }

  add(time, units) {
    if (time.constructor === {}.constructor) {
      Object.keys(time).forEach(function (key) {
        this.timeStamp += this.convertToType(this.time[key], key, "seconds");
      });
      this.timeStamp *= 1000;
    } else if (time.constructor === [].constructor) {
      this.timeStamp += this.convertToType(time[0], time[1], "seconds") * 1000;
    } else {
      this.timeStamp += this.convertToType(time, units, "seconds") * 1000;
    }
  }

  subtract(time, units) {
    if (time.constructor === {}.constructor) {
      Object.keys(time).forEach(function (key) {
        this.timeStamp -= this.convertToType(this.time[key], key, "seconds");
      });
      this.timeStamp *= 1000;
    } else if (time.constructor === [].constructor) {
      this.timeStamp -= this.convertToType(time[0], time[1], "seconds") * 1000;
    } else {
      this.timeStamp -= this.convertToType(time, units, "seconds") * 1000;
    }
  }

  toISOString(units) {
    if (units == "milliseconds") {
      return this.timeStamp;
    }
    return this.convertToType(
      Math.ceil(this.timeStamp / 1000),
      "seconds",
      units
    );
  }
}

module.exports = Duration;
