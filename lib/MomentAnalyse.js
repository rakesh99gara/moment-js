const MomentContainer = require("./MomentContainer");
const LocaleSupport = require("./LanguageSupport");

class MomentAnalyse {
  constructor(date, format, locale, strict) {
    this.date = date;
    this.format = format;
    this.isStrict = strict || false;
    this.locale = locale;

    this.userGivenInputTime = {};
  }

  parseMoment() {
    if (this.date == null) {
      let time = new Date();
      return new MomentContainer(
        time.getTime(),
        time.getTimezoneOffset(),
        this.locale
      );
    }

    if (this.date instanceof Date) {
      return new MomentContainer(
        this.date.getTime(),
        this.date.getTimezoneOffset(),
        this.locale
      );
    }

    return this.parseFromFormat();
  }

  parseFromDate(year, month, date, hour, minute, second, milliSecond, offset) {
    let timeStamp = new Date(year, month - 1, date).getTime();

    return new MomentContainer(
      timeStamp +
        (MomentContainer.convert(hour, "hours", "seconds") +
          MomentContainer.convert(minute, "minutes", "seconds") +
          second) *
          1000 +
        milliSecond,
      offset,
      this.locale
    );
  }

  parseWeekDateFormat(
    year,
    weekOfYear,
    day,
    hour,
    minute,
    second,
    milliSecond,
    offset
  ) {
    let timeStamp = new Date(year, 0, 0).getTime();

    let yearStartingDay = new Date(year, 0, 0).getDay();
    if (yearStartingDay == 0) {
      yearStartingDay = 7;
    }

    let isLastYearIncluded = yearStartingDay <= 4 ? true : false;
    if (weekOfYear == 1) {
      if (isLastYearIncluded) {
        let firstWeekDates = [];
        for (let i = 1; i < yearStartingDay; i++) {
          firstWeekDates.push(i - yearStartingDay);
        }
        for (let i = 0; i < 7 - firstWeekDates.length; i++) {
          firstWeekDates.push(i);
        }
        timeStamp += firstWeekDates[day - 1] * 24 * 60 * 60 * 1000;
      } else {
        timeStamp += (7 - (yearStartingDay - 1)) * 24 * 60 * 60 * 1000;
      }
    } else {
      if (isLastYearIncluded) {
        let lastDate = 7 - (yearStartingDay - 1);
        timeStamp += lastDate * 24 * 60 * 60 * 1000;
        weekOfYear--;
      }

      timeStamp += (--weekOfYear * 7 + (day - 1)) * 24 * 60 * 60 * 1000;
    }

    // if hours mentioned
    timeStamp +=
      MomentContainer.convert(hour, "hours", "seconds") * 1000 +
      MomentContainer.convert(minute, "minutes", "seconds") * 1000 +
      second * 1000 +
      milliSecond;

    return new MomentContainer(timeStamp, offset, this.locale);
  }

  parseOrdinalDateFormat(
    year,
    dayOfYear,
    hour,
    minute,
    second,
    milliSecond,
    offset
  ) {
    let timeStamp = new Date(year, 0, 1).getTime();

    return new MomentContainer(
      timeStamp +
        (MomentContainer.convert(dayOfYear - 1, "days", "seconds") +
          MomentContainer.convert(hour, "hours", "seconds") +
          MomentContainer.convert(minute, "minutes", "seconds") +
          second) *
          1000 +
        milliSecond,
      offset,
      this.locale
    );
  }

  parseFromFormat() {
    let format = null;

    if (
      LocaleSupport[this.locale]["localFormats"].hasOwnProperty(this.format)
    ) {
      format = LocaleSupport[this.locale]["localFormats"][this.format];
    } else {
      format = this.format;
    }

    return this.parseToCustomFormatRegex(format);
  }

  parseToCustomFormatRegex(format) {
    let tempFormat = format;
    Object.keys(LocaleSupport.parseRegex).forEach(function (key) {
      tempFormat = tempFormat.replace(
        new RegExp(key, "g"),
        LocaleSupport.parseRegex[key]
      );
    });

    if (tempFormat == format)
      try {
        throw "parse blueprint does not contain any supported tokes!";
      } catch (e) {
        console.error(e);
        return;
      }

    let regex = this.isStrict
      ? new RegExp("^ *" + tempFormat + " *$")
      : new RegExp(tempFormat);
    return this.makeOrderfromFormat(format, regex);
  }

  makeOrderfromFormat(format, regex) {
    let tempFormat = format;
    let containedTypes = {};
    Object.keys(LocaleSupport.parseRegex).forEach(function (key) {
      if (tempFormat.includes(key)) {
        let pos = tempFormat.indexOf(key);
        tempFormat = tempFormat.replace(
          new RegExp(key),
          "          ".substring(0, key.length)
        );
        containedTypes[pos] = key;
      }
    });

    //arrange contained types in order
    let order = [null];
    Object.values(containedTypes).forEach(function (value) {
      order.push(value);
    });

    return this.parseToCustomFormat(order, regex);
  }

  parseToCustomFormat(order, regex) {
    let tokens = regex.exec(this.date);

    try {
      for (let i = 1; i < order.length; i++) {
        this.userGivenInputTime[order[i]] = isNaN(parseInt(tokens[i]))
          ? tokens[i]
          : parseInt(tokens[i]);
      }
    } catch (e) {
      console.error("Given Time and blue print not matching");
    }

    if (this.userGivenInputTime.hasOwnProperty("x")) {
      return new MomentContainer(this.userGivenInputTime["x"], 0, this.locale);
    }

    if (this.userGivenInputTime.hasOwnProperty("X")) {
      return new MomentContainer(
        this.userGivenInputTime["X"] * 1000,
        0,
        this.locale
      );
    }

    if (this.userGivenInputTime["YY"]) {
      this.userGivenInputTime["YY"] = parseInt(
        this.userGivenInputTime["YY"] > 68
          ? 19
          : 20 + this.userGivenInputTime["YY"].toString()
      );
    }

    if (this.userGivenInputTime["gg"]) {
      this.userGivenInputTime["gg"] = parseInt(
        this.userGivenInputTime["gg"] > 68
          ? 19
          : 20 + this.userGivenInputTime["gg"].toString()
      );
    }

    let year =
      this.userGivenInputTime["YYYY"] ||
      this.userGivenInputTime["YY"] ||
      this.userGivenInputTime["Y"] ||
      this.userGivenInputTime["GGGG"] ||
      this.userGivenInputTime["GG"] ||
      new Date().getFullYear();

    let hour =
      this.userGivenInputTime["HH"] ||
      this.userGivenInputTime["H"] ||
      (this.userGivenInputTime["kk"]
        ? this.userGivenInputTime["kk"] - 1
        : null) ||
      (this.userGivenInputTime["k"]
        ? this.userGivenInputTime["k"] - 1
        : null) ||
      0;

    if (this.userGivenInputTime["hh"]) {
      if (this.userGivenInputTime["a"]) {
        if (this.userGivenInputTime["a"] == "pm") {
          hour = this.userGivenInputTime["hh"] + 12;
        }
      } else if (this.userGivenInputTime["A"]) {
        if (this.userGivenInputTime["A"] == "PM") {
          hour = this.userGivenInputTime["hh"] + 12;
        }
      }
    }

    if (this.userGivenInputTime["h"]) {
      this.userGivenInputTime["h"];
      if (this.userGivenInputTime["a"]) {
        if (this.userGivenInputTime["a"] == "pm") {
          this.userGivenInputTime["h"] += 12;
        }
      } else if (this.userGivenInputTime["A"]) {
        if (this.userGivenInputTime["A"] == "PM") {
          this.userGivenInputTime["h"] += 12;
        }
      }
      hour = this.userGivenInputTime["h"];
    }

    let minute =
      this.userGivenInputTime["mm"] || this.userGivenInputTime["m"] || 0;

    let second =
      this.userGivenInputTime["ss"] || this.userGivenInputTime["s"] || 0;

    let milliSecond = this.userGivenInputTime["SSS"] || 0;

    let offset = new Date().getTimezoneOffset();

    if (this.userGivenInputTime["DDDD"] || this.userGivenInputTime["DDD"]) {
      return this.parseOrdinalDateFormat(
        year,
        this.userGivenInputTime["DDDD"] || this.userGivenInputTime["DD"],
        hour,
        minute,
        second,
        milliSecond,
        offset
      );
    } else if (this.userGivenInputTime["WW"] || this.userGivenInputTime["W"]) {
      return this.parseWeekDateFormat(
        year,
        this.userGivenInputTime["WW"] || this.userGivenInputTime["W"],
        this.userGivenInputTime["E"] || 1,
        hour,
        minute,
        second,
        milliSecond,
        offset
      );
    }

    let month =
      this.userGivenInputTime["MM"] ||
      this.userGivenInputTime["M"] ||
      (this.userGivenInputTime["MMM"]
        ? LocaleSupport[this.locale].monthsShortHand.indexOf(
            this.userGivenInputTime["MMM"]
          ) + 1
        : null) ||
      (this.userGivenInputTime["MMMM"]
        ? LocaleSupport[this.locale].months.indexOf(
            this.userGivenInputTime["MMMM"]
          ) + 1
        : null) ||
      (this.userGivenInputTime["Q"]
        ? this.userGivenInputTime["Q"] * 3 + 1
        : null) ||
      1;

    let date =
      this.userGivenInputTime["DD"] ||
      this.userGivenInputTime["D"] ||
      (this.userGivenInputTime["Do"]
        ? this.userGivenInputTime["Do"].substring(
            0,
            this.userGivenInputTime["Do"].length - 2
          )
        : null) ||
      1;

    /*console.log('year ', year)
      console.log("Date ", date)
      console.log("minutes ", minute)
      console.log("hour ", hour)
      console.log("second ", second)
      console.log("ms ", milliSecond)*/

    return this.parseFromDate(
      year,
      month,
      date,
      hour,
      minute,
      second,
      milliSecond,
      offset
    );
  }
}

module.exports = MomentAnalyse;
