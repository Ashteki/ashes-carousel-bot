const Forge = require("../algo/forge");

describe("Forge tests", function () {
    const forge = new Forge();
    it("create a deck skeleton", function () {
        // forge loads cards
        expect(forge.cards.length).toBeGreaterThan(0);

        // carousel should return pb stub and dice combo
        const deck = forge.createDeck('maeoni-viper', 'CNI');
        expect(deck).not.toBeNull();
        expect(deck.dicepool.length).toBeGreaterThan(0);
        expect(deck.dicepool[0].magic).toBe('ceremonial');
        expect(deck.phoenixborn[0].card.life).toBe(20);
        expect(deck.cards.length).toBe(30);
    });
});