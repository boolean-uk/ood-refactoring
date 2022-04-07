const Cinema = require("../src/cinema.js");

describe("Cinema", () => {
  let cinema;

  beforeEach(() => {
    cinema = new Cinema();
  });

  it("creates new screens", () => {
    cinema.createScreen("Screen 1", 20);
    cinema.createScreen("Screen 2", 25);

    const expected = [
      {
        name: "Screen 1",
        capacity: 20,
        showings: [],
      },
      {
        name: "Screen 2",
        capacity: 25,
        showings: [],
      },
    ];

    expect(cinema.screens).toEqual(expected);
  });

  it("returns error trying to create duplicate screen", () => {
    cinema.createScreen("Screen 1", 20);
    const result = cinema.createScreen("Screen 1", 25);

    const expected = "Screen already exists";

    expect(result).toEqual(expected);
  });

  it("returns error trying to create screen over capacity", () => {
    const result = cinema.createScreen("Screen 1", 250);

    const expected = "Exceeded max capacity";

    expect(result).toEqual(expected);
  });

  it("returns the rating is vaild", () => {
    const result = cinema.isValidRating("U");

    expect(result).toEqual(true);
  });

  it("returns the rating is vaild", () => {
    const result = cinema.isValidRating("UUU");

    expect(result).toEqual(false);
  });

  it("returns the time is vaild", () => {
    const result = cinema.isValidTime("2:40");

    expect(result).toEqual(true);
  });

  it("returns the time is invaild", () => {
    const result = cinema.isValidTime("34:70");

    expect(result).toEqual(false);
  });

  it("returns the time is invaild", () => {
    const result = cinema.isValidTime("340");

    expect(result).toEqual(false);
  });

  it("creates a new film", () => {
    cinema.createFilm("Nomad Land", "12", "1:48");

    const expected = [
      {
        name: "Nomad Land",
        rating: "12",
        duration: "1:48",
      },
    ];

    expect(cinema.films).toEqual(expected);
  });

  it("returns error trying to create duplicate film", () => {
    cinema.createFilm("Nomad Land", "12", "1:48");
    const result = cinema.createFilm("Nomad Land", "15", "2:08");

    const expected = "Film already exists";

    expect(result).toEqual(expected);
  });

  it("returns error trying to create film with invalid rating", () => {
    const result = cinema.createFilm("Invalid film", "hello", "2:08");
    const expected = "Invalid rating";
    expect(result).toEqual(expected);
  });

  it("returns error trying to create film with invalid durations", () => {
    const result = cinema.createFilm("Film", "12", "700");
    const expected = "Invalid duration";
    expect(result).toEqual(expected);
  });

  it("returns error trying to schedule showing when film does not exist", () => {
    cinema.addNew("Film1", "12", "1:20");
    cinema.save("Screen #1", 20);
    const expected = "Invalid film";
    const result = cinema.add("Film doesnt exist!", "Screen #1", "10:00");
    expect(result).toBe(expected);
  });

  it("returns error trying to schedule showing when screen does not exist", () => {
    cinema.addNew("Film1", "12", "1:20");
    cinema.save("Screen #1", 20);
    const expected = "Invalid screen";
    const result = cinema.add("Film1", "Screen Doesnt exist", "10:00");
    expect(result).toBe(expected);
  });

  it("schedules single film", () => {
    cinema.addNew("Film1", "12", "1:20");
    cinema.save("Screen #1", 20);
    const expected = {
      Film1: ["Screen #1 Film1 (12) 10:00 - 11:40"],
    };

    cinema.add("Film1", "Screen #1", "10:00");

    const result = cinema.allShowings();
    expect(result).toEqual(expected);
  });

  it("schedules same film on same screen", () => {
    cinema.addNew("Film1", "12", "1:20");
    cinema.save("Screen #1", 20);

    const expected = {
      Film1: [
        "Screen #1 Film1 (12) 10:00 - 11:40",
        "Screen #1 Film1 (12) 12:10 - 13:50",
      ],
    };

    cinema.add("Film1", "Screen #1", "10:00");
    cinema.add("Film1", "Screen #1", "12:10");

    const result = cinema.allShowings();
    expect(result).toEqual(expected);
  });

  it("schedules same film on multiple screens", () => {
    cinema.addNew("Film1", "12", "1:20");
    cinema.save("Screen #1", 20);
    cinema.save("Screen #2", 20);

    const expected = {
      Film1: [
        "Screen #1 Film1 (12) 10:00 - 11:40",
        "Screen #2 Film1 (12) 10:00 - 11:40",
      ],
    };

    cinema.add("Film1", "Screen #1", "10:00");
    cinema.add("Film1", "Screen #2", "10:00");

    const result = cinema.allShowings();
    expect(result).toEqual(expected);
  });

  it("schedules multiple films on multiple screens", () => {
    cinema.addNew("Film1", "12", "1:20");
    cinema.addNew("Film2", "15", "2:00");
    cinema.save("Screen #1", 20);
    cinema.save("Screen #2", 20);

    const expected = {
      Film1: [
        "Screen #1 Film1 (12) 10:00 - 11:40",
        "Screen #2 Film1 (12) 12:00 - 13:40",
      ],
      Film2: [
        "Screen #1 Film2 (15) 12:00 - 14:20",
        "Screen #2 Film2 (15) 09:00 - 11:20",
      ],
    };

    cinema.add("Film1", "Screen #1", "10:00");
    cinema.add("Film1", "Screen #2", "12:00");

    cinema.add("Film2", "Screen #1", "12:00");
    cinema.add("Film2", "Screen #2", "09:00");

    const result = cinema.allShowings();
    expect(result).toEqual(expected);
  });

  it("returns error when film screening overlaps start", () => {
    cinema.addNew("Film1", "12", "1:00");
    cinema.save("Screen #1", 20);

    cinema.add("Film1", "Screen #1", "10:00");
    const result = cinema.add("Film1", "Screen #1", "11:00");
    const expected = "Time unavailable";
    expect(result).toEqual(expected);
  });

  it("returns error when film screening overlaps end", () => {
    cinema.addNew("Film1", "12", "1:00");
    cinema.save("Screen #1", 20);

    cinema.add("Film1", "Screen #1", "10:00");
    const result = cinema.add("Film1", "Screen #1", "09:10");
    const expected = "Time unavailable";
    expect(result).toEqual(expected);
  });

  it("returns error when film screening overlaps all", () => {
    cinema.addNew("Film1", "12", "1:00");
    cinema.addNew("Film2", "12", "4:00");
    cinema.save("Screen #1", 20);

    cinema.add("Film1", "Screen #1", "10:00");
    const result = cinema.add("Film2", "Screen #1", "08:30");
    const expected = "Time unavailable";
    expect(result).toEqual(expected);
  });
});
