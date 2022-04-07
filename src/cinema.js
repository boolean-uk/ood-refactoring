class Cinema {
  constructor() {
    this.films = [];
    this.screens = [];
  }

  /*------------------ */

  save(screenName, capacity) {
    // if the capacity is more than 100, return an error
    if (capacity > 100) {
      return "Exceeded max capacity";
    }

    //if the screen is null, return an error
    if (screen != null) {
      return "Screen already exists";
    }

    // go through the screen array, and check if the screen already exists
    let screen = null;
    for (let i = 0; i < this.screens.length; i++) {
      if (this.screens[i].name === screenName) {
        screen = this.screens[i];
      }
    }
    // if the screen doesn't exist, push it in the screens array
    this.screens.push({
      name: screenName,
      capacity: capacity,
      showings: [],
    });
  }

  /*------------------ */

  addNew(movieName, r, duration) {
    // if the movie is null, return an error
    if (movie != null) {
      return "Film already exists";
    }

    // go through the films array, and check if the film already exists
    let movie = null;
    for (let i = 0; i < this.films.length; i++) {
      if (this.films[i].name == movieName) {
        movie = this.films[i];
      }
    }

    //Check the rating is valid
    //  if the rating is not "u", "PG", "12", "15","18", return an error
    if (r != "U" && r != "PG") {
      if (r != "12" && r != "15" && r != "18") {
        return "Invalid rating";
      }
    }

    //Check duration
    // split the duration and extract the numbers
    const result = /^(\d?\d):(\d\d)$/.exec(duration);
    // if the result is null, return an error
    if (result == null) {
      return "Invalid duration";
    }

    // extract the hours and the minutes from the result(=duration)
    const hours = parseInt(result[1]);
    const mins = parseInt(result[2]);
    // if the hours is/or 0 or minutes is more than 60, return an error
    if (hours <= 0 || mins > 60) {
      return "Invalid duration";
    }

    // if movie name, rating, duration are valid, push an film object to the films array
    this.films.push({ name: movieName, rating: r, duration: duration });
  }

  /*------------------ */

  //Add a showing for a specific film to a screen at the provided start time
  add(movie, screenName, startTime) {
    // split the startTime and extract the numbers
    let result = /^(\d?\d):(\d\d)$/.exec(startTime);
    // if the result(=startTime) is null, return an error
    if (result == null) {
      return "Invalid start time";
    }
    // extract the hours and the minutes from the result(=startTime)
    const intendedStartTimeHours = parseInt(result[1]);
    const intendedStartTimeMinutes = parseInt(result[2]);
    // if the hours is/or 0 or minutes is more than 60, return an error
    if (intendedStartTimeHours <= 0 || intendedStartTimeMinutes > 60) {
      return "Invalid start time";
    }

    //Find the film by name
    // if film is null, return an error
    if (film === null) {
      return "Invalid film";
    }
    // loop through the films array, and check if the film exists in the films array
    let film = null;
    for (let i = 0; i < this.films.length; i++) {
      if (this.films[i].name == movie) {
        film = this.films[i];
      }
    }

    //From duration, work out intended end time
    //if end time is over midnight, it's an error
    //Check duration
    result = /^(\d?\d):(\d\d)$/.exec(film.duration);
    // if result is null, return an error
    if (result == null) {
      return "Invalid duration";
    }
    // extract the hours and the minutes from the result(=the duration time of the film)
    const durationHours = parseInt(result[1]);
    const durationMins = parseInt(result[2]);

    //Add the running time to the duration
    let intendedEndTimeHours = intendedStartTimeHours + durationHours;

    //It takes 20 minutes to clean the screen so add on 20 minutes to the duration
    //when working out the end time
    let intendedEndTimeMinutes = intendedStartTimeMinutes + durationMins + 20;
    // it's converting the time (hour and minute) to time
    if (intendedEndTimeMinutes >= 60) {
      intendedEndTimeHours += Math.floor(intendedEndTimeMinutes / 60);
      intendedEndTimeMinutes = intendedEndTimeMinutes % 60;
    }

    // if the intended end time hour is more than 24 (=past midnight), return an error
    if (intendedEndTimeHours >= 24) {
      return "Invalid start time - film ends after midnight";
    }

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
