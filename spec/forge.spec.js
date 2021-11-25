const Carousel = require("../algo/carousel");
const Forge = require("../algo/forge");
const TextExporter = require("../export/textexporter");

describe("Forge tests", function () {
    const forge = new Forge();
    it("create an ashes live deck within dice types", function () {
        // carousel should return pb stub and dice combo
        const deck = forge.createDeck('maeoni-viper', 'HND');
        expect(deck).not.toBeNull();
        expect(deck.dice.length).toBeGreaterThan(0);
        expect(deck.dice[0].name).toBe('charm');
        expect(deck.dice[1].name).toBe('natural');
        expect(deck.dice[2].name).toBe('divine');
        expect(deck.phoenixborn.name).toBe('Maeoni Viper');
        expect(deck.phoenixborn.life).toBe(20);
        expect(deck.cards.every(c => c.count < 4)).toBeTrue();
        expect(deck.cards.reduce((a, b) => a + b.count, 0)).toBe(30);
        deck.cards.forEach(c => {
            if (c.card.phoenixborn) {
                expect(c.card.phoenixborn).toBe('Maeoni Viper');
            }
        });
        // unique is in dice type so put it in x3
        expect(deck.cards.find(c => c.id === 'summon-silver-snake').count).toBe(3);
        expect(deck.conjurations.length).toBeGreaterThan(0);

        console.log(new TextExporter().export(deck));
    });


    it("leaves out unique if not in dice type", function () {
        // carousel should return pb stub and dice combo
        const deck = forge.createDeck('maeoni-viper', 'CNI');
        expect(deck).not.toBeNull();
        expect(deck.dice.length).toBeGreaterThan(0);
        expect(deck.dice[0].name).toBe('ceremonial');
        expect(deck.dice[1].name).toBe('natural');
        expect(deck.dice[2].name).toBe('illusion');
        expect(deck.cards.find(c => c.id === 'summon-silver-snake')).toBeUndefined();
    });

    it('generates bulk amounts', function () {
        let car = new Carousel();
        console.log('# | Phoenixborn | Action Spell | Ally |Ready Spell | Alteration Spell | Reaction Spell')
        for (let i = 0; i < 20; i++) {
            const caro = car.getCarousel()
            const diceString = caro.dice.map((dObj) => dObj.text).join('');
            const deck = forge.createDeck(caro.pb.stub, diceString);
            console.log(i, '|', caro.pb.name, diceString, deck.dice.reduce((agg, d) => agg + d.count, ''), ' | ',
                deck.cards.filter(c => c.card.type === 'Action Spell').length, ' | ',
                deck.cards.filter(c => c.card.type === 'Ally').length, ' | ',
                deck.cards.filter(c => c.card.type === 'Ready Spell').length, ' | ',
                deck.cards.filter(c => c.card.type === 'Alteration Spell').length, ' | ',
                deck.cards.filter(c => c.card.type === 'Reaction Spell').length,
            );
        }
    });
});