class AllShowings {
    constructor(screens) {
        this.screens = screens;
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

module.exports = AllShowings;