const ParseTime = require("./parseTime.js");

class StartTimeOverlap {
    constructor(theatre, startTime) {
        this.theatre = theatre;
        this.startTime = startTime;
    }
    startTimeOverlap() {
        let error = false;
        for (let i = 0; i < this.theatre.showings.length; i++) {
            //Get the start time in hours and minutes
            const startTime = this.theatre.showings[i].startTime;
            console.log("10.....", startTime);

            const startTimeFromTheatreShowings = new ParseTime(startTime);
            startTimeFromTheatreShowings.isValid();

            const startTimeHours = startTimeFromTheatreShowings.hours();
            const startTimeMins = startTimeFromTheatreShowings.minutes();

            //Get the end time in hours and minutes
            const endTime = this.theatre.showings[i].endTime;

            const checkEndingTime = new ParseTime(endTime);
            checkEndingTime.isValid();

            const endTimeHours = checkEndingTime.hours();
            const endTimeMins = checkEndingTime.minutes();

            //if intended start time is between start and end
            const intendedStartTime = new Date();
            intendedStartTime.setMinutes(intendedStartTimeMinutes);
            intendedStartTime.setHours(intendedStartTimeHours);

            const intendedEndTime = new Date();
            intendedEndTime.setMinutes(intendedEndTimeMinutes);
            intendedEndTime.setHours(intendedEndTimeHours);

            const startingTime = new Date();
            startingTime.setMinutes(startTimeMins);
            startingTime.setHours(startTimeHours);

            const endingTime = new Date();
            endingTime.setMinutes(endTimeMins);
            endingTime.setHours(endTimeHours);

            if (
                (intendedStartTime > startingTime && intendedStartTime < endingTime) ||
                (intendedEndTime > startingTime && intendedEndTime < endingTime) ||
                (intendedStartTime < startingTime && intendedEndTime > endingTime)
            ) {
                error = true;
                break;
            }
        }

        if (error) {
            return "Time unavailable";
        }
    }
}

module.exports = StartTimeOverlap;