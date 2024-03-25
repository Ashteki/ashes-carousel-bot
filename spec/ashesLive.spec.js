const AshesLiveHelper = require('../algo/AshesLiveHelper');
const Carousel = require("../algo/carousel");

describe("Ashes Live lookup tests", function () {
    const helper = new AshesLiveHelper();
    it("a full card name returns entry", async function () {
        let output = await helper.findCard('Purge');
        expect(output.url).toBe('https://ashes.live/cards/purge');
        expect(output.imageUrl).toBe('https://cdn.ashes.live/images/cards/purge.jpg')
    });
});
