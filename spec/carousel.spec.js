const Carousel = require("../algo/carousel");

describe("Carousel tests", function () {
    const carousel = new Carousel();
    it("a simple call returns an entry", function () {
        let entry = carousel.getCarouselEntry();
        console.log(entry);
        expect(entry).not.toBeNull();
    });

    it("coal-off mode returns coal with dice", function () {
        let caro = carousel.getCarousel('coal-roarkwin');
        console.log(caro);
        expect(caro.pb.stub).toBe('coal-roarkwin');
    });
});