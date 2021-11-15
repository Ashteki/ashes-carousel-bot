const DeckBuilder = require("./helpers/deckbuilder");

class Forge {
    constructor() {
        this.deckBuilder = new DeckBuilder();
    }

    get cards() {
        return this.deckBuilder.cards;
    }

    createDeck(phoenixborn, diceString) {
        const dice = diceString.split('').map(c => ({ magic: this.diceCharToMagicType(c), count: 0 }));


        return this.deckBuilder.buildDeck(
            phoenixborn,
            dice
        );
    }

    diceCharToMagicType(dChar) {
        let magics = [
            { char: 'H', magic: 'charm' },
            { char: 'C', magic: 'ceremonial' },
            { char: 'I', magic: 'illusion' },
            { char: 'N', magic: 'natural' },
            { char: 'D', magic: 'divine' },
            { char: 'S', magic: 'sympathy' },
            { char: 'T', magic: 'time' }
        ];
        return magics.find(m => m.char === dChar).magic;
    }
}

module.exports = Forge;