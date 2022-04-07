const Cinema = require("../src/cinema");
const ParseTime = require("../src/parseTime.js");

describe("ParseTime", () => {
    let time;

    it("parses time to check if it valid and returns hours and minutes", () => {
        let time = new ParseTime("23:22");
        time.isValid();

        const expected = true;

        expect(time.isValid()).toEqual(expected);
    });

    it("parses time to check if it valid and returns hours and minutes", () => {
        let time = new ParseTime("23:15");

        const expected = 23;

        expect(time.hours()).toEqual(expected);
    });
    it("parses time to check if it valid and returns hours and minutes", () => {
        let time = new ParseTime("23:15");
        time.minutes();

        const expected = 15;

        expect(time.minutes()).toEqual(expected);
    });
    it("parses time to check if it valid and returns hours and minutes", () => {
        let time = new ParseTime("00:22");
        time.isValid();

        const expected = true;

        expect(time.isValid()).toEqual(expected);
    });
});