const ParseTime = require("./parseTime.js");

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

    //Add a new film
    addNewFilmToFilmArray(movieName, rating, duration) {
        //Check the film doesn't already exist
        const ratings = ["U", "PG", "12", "15", , "18"];
        let movie = null;
        for (let i = 0; i < this.films.length; i++) {
            if (this.films[i].name == movieName) {
                movie = this.films[i];
            }
        }

        if (movie != null) {
            return "Film already exists";
        }

        //Check the rating is valid

        if (ratings.includes(rating) === false) {
            return "Invalid rating";
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

    //Add a showing for a specific film to a screen at the provided start time
    addShowingToScreenNameStartTime(movie, screenName, startTime) {
        // Intended start time of film

        const startingTime = new ParseTime(startTime);
        startingTime.isValid();

        // let filmStartTime = /^(\d?\d):(\d\d)$/.exec(startTime);
        // if (filmStartTime == null) {
        //     return "Invalid start time";
        // }

        const intendedStartTimeHours = startingTime.hours();
        const intendedStartTimeMinutes = startingTime.minutes();
        // if (intendedStartTimeHours <= 0 || intendedStartTimeMinutes > 60) {
        //     return "Invalid start time";
        // }

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

        // let filmDurationTime = /^(\d?\d):(\d\d)$/.exec(film.duration);
        // if (filmDurationTime == null) {
        //     return "Invalid duration";
        // }

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
        let theatre = null;
        for (let i = 0; i < this.screens.length; i++) {
            if (this.screens[i].name == screenName) {
                theatre = this.screens[i];
            }
        }

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
            // let startTimeFromTheatreShowings = /^(\d?\d):(\d\d)$/.exec();
            // if (startTimeFromTheatreShowings == null) {
            //     return "Invalid start time";
            // }

            const startTimeHours = startTimeFromTheatreShowings.hours();
            const startTimeMins = startTimeFromTheatreShowings.minutes();
            // if (startTimeHours <= 0 || startTimeMins > 60) {
            //     return "Invalid start time";
            // }

            //Get the end time in hours and minutes
            const endTime = theatre.showings[i].endTime;

            const checkEndingTime = new ParseTime(endTime);
            checkEndingTime.isValid();

            // let checkEndingTime = /^(\d?\d):(\d\d)$/.exec(endTime);
            // if (checkEndingTime == null) {
            //     return "Invalid end time";
            // }

            const endTimeHours = checkEndingTime.hours();
            const endTimeMins = checkEndingTime.minutes();
            // if (endTimeHours <= 0 || endTimeMins > 60) {
            //     return "Invalid end time";
            // }

            //if intended start time is between start and end
            const d1 = new Date();
            d1.setMilliseconds(0);
            d1.setSeconds(0);
            d1.setMinutes(intendedStartTimeMinutes);
            d1.setHours(intendedStartTimeHours);

            const d2 = new Date();
            d2.setMilliseconds(0);
            d2.setSeconds(0);
            d2.setMinutes(intendedEndTimeMinutes);
            d2.setHours(intendedEndTimeHours);

            const d3 = new Date();
            d3.setMilliseconds(0);
            d3.setSeconds(0);
            d3.setMinutes(startTimeMins);
            d3.setHours(startTimeHours);

            const d4 = new Date();
            d4.setMilliseconds(0);
            d4.setSeconds(0);
            d4.setMinutes(endTimeMins);
            d4.setHours(endTimeHours);

            if (
                (d1 > d3 && d1 < d4) ||
                (d2 > d3 && d2 < d4) ||
                (d1 < d3 && d2 > d4)
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
        let showings = {};
        for (let i = 0; i < this.screens.length; i++) {
            const screen = this.screens[i];
            for (let j = 0; j < screen.showings.length; j++) {
                const showing = screen.showings[j];
                if (!showings[showing.film.name]) {
                    showings[showing.film.name] = [];
                }
                showings[showing.film.name].push(
                    `${screen.name} ${showing.film.name} (${showing.film.rating}) ${showing.startTime} - ${showing.endTime}`
                );
            }
        }

        return showings;
    }
}

module.exports = Cinema;