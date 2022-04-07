const ParseTime = require("./parseTime.js");
const AllShowings = require("./allShowings.js");

class Cinema {
    constructor() {
        this.films = [];
        this.screens = [];
    }

    //Add a new screen
    addNewScreenByNameCapacity(screenName, capacity) {
        if (capacity > 100) {
            return "Exceeded max capacity";
        }

        //Check the screen doesn't already exist
        let screen = null;
        for (let i = 0; i < this.screens.length; i++) {
            if (this.screens[i].name === screenName) {
                screen = this.screens[i];
            }
        }

        if (screen != null) {
            return "Screen already exists";
        }

        this.screens.push({
            name: screenName,
            capacity: capacity,
            showings: []
        });
    }

    getFilm(movieName) {
        let film = null;
        for (let i = 0; i < this.films.length; i++) {
            if (this.films[i].name == movieName) {
                film = this.films[i];
                break;
            }
        }
        return film;
    }

    //Add a new film
    addNewFilmToFilmArray(movieName, rating, duration) {
        //Check the rating is valid

        const ratings = ["U", "PG", "12", "15", , "18"];
        if (ratings.includes(rating) === false) {
            return "Invalid rating";
        }
        //Check the film doesn't already exist

        let movie = this.getFilm(movieName);

        if (movie != null) {
            return "Film already exists";
        }

        //Check duration

        const result = /^(\d?\d):(\d\d)$/.exec(duration);

        if (result == null) {
            return "Invalid duration";
        }

        const hours = parseInt(result[1]);
        const mins = parseInt(result[2]);
        if (hours <= 0 || mins > 60) {
            return "Invalid duration";
        }

        this.films.push({ name: movieName, rating: rating, duration: duration });
    }

    getScreenByName(screenName) {
        let theatre = null;
        for (let i = 0; i < this.screens.length; i++) {
            if (this.screens[i].name == screenName) {
                theatre = this.screens[i];
                break;
            }
        }
        return theatre;
    }

    //Add a showing for a specific film to a screen at the provided start time
    addShowingToScreenNameStartTime(movie, screenName, startTime) {
        // Intended start time of film

        const startingTime = new ParseTime(startTime);
        startingTime.isValid();

        const intendedStartTimeHours = startingTime.hours();
        const intendedStartTimeMinutes = startingTime.minutes();

        //Find the film by name
        let film = this.getFilm(movie);

        if (film === null) {
            return "Invalid film";
        }

        //From duration, work out intended end time
        //if end time is over midnight, it's an error
        //Check duration

        const filmDurationTime = new ParseTime(film.duration);
        filmDurationTime.isValid();

        const durationHours = filmDurationTime.hours();
        const durationMins = filmDurationTime.minutes();

        //Add the running time to the duration
        let intendedEndTimeHours = intendedStartTimeHours + durationHours;

        //It takes 20 minutes to clean the screen so add on 20 minutes to the duration
        //when working out the end time
        let intendedEndTimeMinutes = intendedStartTimeMinutes + durationMins + 20;
        if (intendedEndTimeMinutes >= 60) {
            intendedEndTimeHours += Math.floor(intendedEndTimeMinutes / 60);
            intendedEndTimeMinutes = intendedEndTimeMinutes % 60;
        }

        if (intendedEndTimeHours >= 24) {
            return "Invalid start time - film ends after midnight";
        }

        //Find the screen by name
        let theatre = this.getScreenByName(screenName);

        if (theatre === null) {
            return "Invalid screen";
        }

        //Go through all existing showings for this film and make
        //sure the start time does not overlap
        let error = false;
        for (let i = 0; i < theatre.showings.length; i++) {
            //Get the start time in hours and minutes
            const startTime = theatre.showings[i].startTime;

            const startTimeFromTheatreShowings = new ParseTime(startTime);
            startTimeFromTheatreShowings.isValid();

            const startTimeHours = startTimeFromTheatreShowings.hours();
            const startTimeMins = startTimeFromTheatreShowings.minutes();

            //Get the end time in hours and minutes
            const endTime = theatre.showings[i].endTime;

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

        //Add the new start time and end time to the showing
        theatre.showings.push({
            film: film,
            startTime: startTime,
            endTime: intendedEndTimeHours + ":" + intendedEndTimeMinutes
        });
    }

    allShowings() {
        const allShows = new AllShowings(this.screens);
        return allShows.showAllShowings();
    }
}

module.exports = Cinema;