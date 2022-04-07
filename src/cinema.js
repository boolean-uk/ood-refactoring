class Cinema {
  constructor() {
    this.films = [];
    this.screens = [];
  }

  findScreen(screenName) {
    const targetScreen = this.screens.find(
      (screen) => screen.name === screenName
    );
    return targetScreen;
  }

  createScreen(screenName, capacity) {
    if (capacity > 100) return "Exceeded max capacity";
    if (this.findScreen(screenName)) return "Screen already exists";

    this.screens.push({
      name: screenName,
      capacity: capacity,
      showings: [],
    });
  }

  findFilm(filmName) {
    const targetFilm = this.films.find((film) => film.name === filmName);
    if (!targetFilm) return false;
    return targetFilm;
  }

  isValidRating(rating) {
    const validRatings = ["U", "PG", "12", "15", "18"];
    if (!validRatings.includes(rating)) return false;
    return true;
  }

  isValidTime(time) {
    const hoursMins = time.split(":");
    const hours = Number(hoursMins[0]);
    const mins = Number(hoursMins[1]);

    if (!time.includes(":")) return false;
    if (hours < 0 || mins > 60) return false;
    return true;
  }

  createFilm(filmName, rating, duration) {
    const film = { name: filmName, rating: rating, duration: duration };

    if (this.findFilm(filmName)) return "Film already exists";
    if (!this.isValidRating(rating)) return "Invalid rating";
    if (!this.isValidTime(duration)) return "Invalid duration";

    this.films.push(film);
  }

  /*------------------ */
  isValidEndTime(startTime, duration) {
    const startHoursMins = startTime.split(":");
    const durationHoursMins = duration.split(":");

    const startHours = Number(startHoursMins[0]);
    const startMins = Number(startHoursMins[1]);
    const durationHours = Number(durationHoursMins[0]);
    const durationMins = Number(durationHoursMins[1]);

    let endHours = startHours + durationHours;

    let endMins = startMins + durationMins + 20;
    if (endMins >= 60) {
      endHours += Math.floor(endMins / 60);
      endMins = endMins % 60;
    }

    if (endHours >= 24) return false;

    return true;
  }

  //Add a showing for a specific film to a screen at the provided start time
  addFilmToScreen(filmName, screenName, startTime) {
    if (findFilm(filmName)) return "Film already exists";
    if (!isValidTime(startTime)) return "Invalid time";
    //From duration, work out intended end time
    //if end time is over midnight, it's an error

    //Find the screen by name
    // loop through the screens array, and check if the screen exists
    let theatre = null;
    for (let i = 0; i < this.screens.length; i++) {
      if (this.screens[i].name == screenName) {
        theatre = this.screens[i];
      }
    }

    // if the theathre is null, return an error
    if (theatre === null) {
      return "Invalid screen";
    }

    //Go through all existing showings for this film and make sure the start time does not overlap
    let error = false;
    // loop through the theatre.showings array??????? and check the start time
    for (let i = 0; i < theatre.showings.length; i++) {
      //Get the start time in hours and minutes
      const startTime = theatre.showings[i].startTime;
      // split the startTime and extract the numbers
      result = /^(\d?\d):(\d\d)$/.exec(startTime);
      // if the result(=startTime) is null, return an error
      if (result == null) {
        return "Invalid start time";
      }

      // extract the hours and the minutes from the result(=the startTime)
      const startTimeHours = parseInt(result[1]);
      const startTimeMins = parseInt(result[2]);
      // if the startTimeHour is lower than 0 or startTimeMins is more than 60, return an error
      if (startTimeHours <= 0 || startTimeMins > 60) {
        return "Invalid start time";
      }

      //Get the end time in hours and minutes
      const endTime = theatre.showings[i].endTime;
      result = /^(\d?\d):(\d\d)$/.exec(endTime);
      // if result is null, return an error
      if (result == null) {
        return "Invalid end time";
      }
      // extract the hours and the minutes from the result(=the endTime)
      const endTimeHours = parseInt(result[1]);
      const endTimeMins = parseInt(result[2]);
      // if the endTimeHour is lower than 0 or startTimeMins is more than 60, return an error
      if (endTimeHours <= 0 || endTimeMins > 60) {
        return "Invalid end time";
      }

      //if intended start time is between start and end
      const d1 = new Date();
      // sets the milliseconds for a specified date according to local time
      d1.setMilliseconds(0);
      // sets the seconds for a specified date according to local time.
      d1.setSeconds(0);
      // sets the minutes of the intendedStartTime
      d1.setMinutes(intendedStartTimeMinutes);
      // sets the hours of the intendedStartTime
      d1.setHours(intendedStartTimeHours);

      // same drill but with the intended end time
      const d2 = new Date();
      d2.setMilliseconds(0);
      d2.setSeconds(0);
      d2.setMinutes(intendedEndTimeMinutes);
      d2.setHours(intendedEndTimeHours);

      // same drill but with the startTime
      const d3 = new Date();
      d3.setMilliseconds(0);
      d3.setSeconds(0);
      d3.setMinutes(startTimeMins);
      d3.setHours(startTimeHours);

      // same drill but with endTime
      const d4 = new Date();
      d4.setMilliseconds(0);
      d4.setSeconds(0);
      d4.setMinutes(endTimeMins);
      d4.setHours(endTimeHours);

      if (
        // if intendedStartTime is bigger than startTime && intendedStartTime is lower than endtime
        (d1 > d3 && d1 < d4) ||
        // OR if intendedStartTime is bigger than startTime && intendedEndTime is lower than endTime
        (d2 > d3 && d2 < d4) ||
        // OR if intendedStartTime is lower than intendedStartTime && intendedEndTime is lower than endTime
        (d1 < d3 && d2 > d4)
      ) {
        // Then there will be an error
        error = true;
        break;
      }
    }

    // if error is true, return an error
    if (error) {
      return "Time unavailable";
    }

    //Add the new start time and end time to the showing
    theatre.showings.push({
      film: film,
      startTime: startTime,
      endTime: intendedEndTimeHours + ":" + intendedEndTimeMinutes,
    });
  }

  /*------------------ */

  allShowings() {
    let showings = {};
    // loop throught the this.screens array
    for (let i = 0; i < this.screens.length; i++) {
      // screen is every element in the screens array
      const screen = this.screens[i];
      // loop through the showings in the screen array
      for (let j = 0; j < screen.showings.length; j++) {
        // showings is every element in the screen array
        const showing = screen.showings[j];
        // if showing's film name is false (or an empty object???), then assign it to an empty array
        if (!showings[showing.film.name]) {
          showings[showing.film.name] = [];
        }
        // push a string (screen name, showing film name, showing film rating, starttime-endtime) into the showings array???
        showings[showing.film.name].push(
          `${screen.name} ${showing.film.name} (${showing.film.rating}) ${showing.startTime} - ${showing.endTime}`
        );
      }
    }

    return showings;
  }
}

module.exports = Cinema;
