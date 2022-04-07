class ParseTime {
    constructor(timeString) {
        this.timeString = timeString;
    }

    isValid() {
        let result = /^(\d?\d):(\d\d)$/.exec(this.timeString);
        if (result == null) {
            return "Invalid start time";
        }
        const hours = parseInt(result[1]);
        const minutes = parseInt(result[2]);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 60) {
            return "Invalid start time";
        }
        return true;
    }

    hours() {
        let result = /^(\d?\d):(\d\d)$/.exec(this.timeString);
        const hours = parseInt(result[1]);
        const minutes = parseInt(result[2]);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 60) {
            return "Invalid start time";
        }
        return hours;
    }

    minutes() {
        let result = /^(\d?\d):(\d\d)$/.exec(this.timeString);
        const hours = parseInt(result[1]);
        const minutes = parseInt(result[2]);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 60) {
            return "Invalid start time";
        }
        return minutes;
    }
}

module.exports = ParseTime;