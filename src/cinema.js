class Cinema {
  constructor() {
    this.films = [];
    this.theatres = [];
  }

  //Add a new screen
  save(screenName, capacity) {
    if (capacity > 100) {
      return "Exceeded max capacity";
    }

    //Check the screen doesn't already exist
    let screen = null;
    for (let i = 0; i < this.theatres.length; i++) {
      if (this.theatres[i].name === screenName) {
        screen = this.theatres[i];
      }
    }

    if (screen != null) {
      return "Screen already exists";
    }

    this.theatres.push({
      name: screenName,
      capacity: capacity,
      showings: [],
    });
  }

  //Add a new film
  addNew(movieName, r, duration) {
    //Check the film doesn't already exist
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
    if (r != "U" && r != "PG") {
      if (r != "12" && r != "15" && r != "18") {
        return "Invalid rating";
      }
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

    this.films.push({ name: movieName, rating: r, duration: duration });
  }

  //Add a showing for a specific film to a screen at the provided start time
  add(movie, screenName, startTime) {
    if (!this.isValidTime(startTime)) return "Invalid start time";
    const [intendedStartTimeHours, intendedStartTimeMinutes] =
      this.passHoursAndMinutes(startTime);

    //Find the film by name
    const film = this.getFilm(movie);
    if (film === undefined) return "Invalid film";

    //From duration, work out intended end time
    //if end time is over midnight, it's an error
    //Check duration
    if (!this.isValidTime(film.duration)) return "Invalid duration";
    const [durationHours, durationMins] = this.passHoursAndMinutes(
      film.duration
    );

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
    const theatre = this.getTheatre(screenName);
    if (theatre === undefined) return "Invalid screen";

    //Go through all existing showings for this film and make
    //sure the start time does not overlap
    let error = false;
    for (let i = 0; i < theatre.showings.length; i++) {
      //Get the start time in hours and minutes
      const [existingShowingStartTimeHours, existingShowingStartTimeMins] =
        this.passHoursAndMinutes(theatre.showings[i].startTime);

      //Get the end time in hours and minutes
      const [existingShowingEndTimeHours, existingShowingEndTimeMins] =
        this.passHoursAndMinutes(theatre.showings[i].endTime);

      //if intended start time is between start and end
      const d1 = this.createDateWithSetTime(
        intendedStartTimeHours,
        intendedStartTimeMinutes
      );
      const d2 = this.createDateWithSetTime(
        intendedEndTimeHours,
        intendedEndTimeMinutes
      );
      const d3 = this.createDateWithSetTime(
        existingShowingStartTimeHours,
        existingShowingStartTimeMins
      );
      const d4 = this.createDateWithSetTime(
        existingShowingEndTimeHours,
        existingShowingEndTimeMins
      );

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
      endTime: intendedEndTimeHours + ":" + intendedEndTimeMinutes,
    });
  }

  allShowings() {
    let showings = {};
    for (let i = 0; i < this.theatres.length; i++) {
      const screen = this.theatres[i];
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

  getTheatre(screenName) {
    return this.theatres.find((el) => el.name === screenName);
  }

  getFilm(filmName) {
    return this.films.find((el) => el.name === filmName);
  }

  splitHoursAndMinutes(time) {
    const splitTime = time.split(":").map((el) => parseInt(el));
    return splitTime.length === 2 ? splitTime : null;
  }

  isValidTime(time) {
    const splitTime = this.splitHoursAndMinutes(time);
    if (splitTime == null) return false;

    const hours = splitTime[0];
    const minutes = splitTime[1];

    if (hours <= 0 || minutes > 60) return false;

    return true;
  }

  createDateWithSetTime(hours, minutes) {
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  }

  passHoursAndMinutes(time) {
    const timeArr = this.splitHoursAndMinutes(time);
    return [...timeArr];
  }
}

module.exports = Cinema;
