const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const PathToSubModulePacks = path.join(__dirname, '../data');

class Forge {
    constructor() {
        const conjuredCards = ['Conjuration', 'Conjured Alteration Spell'];
        this.cardsByCode = this.loadCards(PathToSubModulePacks);
        this.allCards = Object.values(this.cardsByCode);
        this.conjurations = this.allCards.filter((c) => conjuredCards.includes(c.type));
        this.playableCards = this.allCards.filter((c) => ![...conjuredCards, 'Phoenixborn'].includes(c.type));
    }

    createDeck(pbStub, diceString) {
        const dice = diceString.split('').map(c => ({ name: this.diceCharToMagicType(c), count: 0 }));

        const deck = this.buildDeck(
            pbStub,
            dice
        );

        return deck;
    }

    buildDeck(pbStub, dice) {
        var pbData = this.getCard(pbStub);

        this.legalCards = this.playableCards.filter(card => {
            // allowed dice types only
            return (!card.dice || this.allowedDiceTypes(card.dice, dice)) &&
                // no pb uniques unless it's mine
                (!card.phoenixborn || card.phoenixborn === pbData.name)
        });

        // get 30 cards
        const deckCards = [];
        // add unique if it is allowed dice types
        const unique = this.getPbUniqueCard(pbData.name);
        if (this.allowedDiceTypes(unique.dice, dice)) {
            deckCards.push(unique);
            deckCards.push(unique);
            deckCards.push(unique);
        }

        // draw 30 cards
        while (deckCards.length < 30) {
            const nextCard = this.getPlayableCard();
            if (this.cardCanBeAdded(deckCards, nextCard, pbData)) {
                deckCards.push(nextCard);
            }
        }

        // process cards to card counts
        var cardCounts = [];
        deckCards.forEach(c => {
            const cc = cardCounts.find(cc => cc.id === c.stub);
            if (cc) {
                cc.count++;
            } else {
                cardCounts.push({
                    id: c.stub,
                    count: 1,
                    card: c
                });
            }
        });

        const diceCounts = { total: 0 };
        dice.forEach(d => {
            diceCounts[d.name] = deckCards.filter(dc => dc.dice && dc.dice.includes(d.name)).length;
            diceCounts.total += diceCounts[d.name];
        });
        let diceTotal = 0;
        dice.forEach(d => {
            d.count = Math.round(diceCounts[d.name] / diceCounts.total * 10);
            diceTotal += d.count;
        })
        if (diceTotal === 9) {
            dice[0].count += 1;
        }

        return {
            cards: Object.values(cardCounts),
            phoenixborn: pbData,
            dice: dice
        };
    }

    cardCanBeAdded(deckCards, nextCard, pbData) {
        if (nextCard.type === 'Ready Spell') {
            const readySpellCount = deckCards.filter(c => c.type === 'Ready Spell').length;
            if (readySpellCount > pbData.spellboard) {
                return false;
            }
        }
        return deckCards.filter(c => c === nextCard).length < 3;
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

    allowedDiceTypes(diceTypes, legalDice) {
        return diceTypes.reduce((agg, dt) => agg && (dt === 'basic' || legalDice.some(ld => ld.name === dt)), true)
    }

    loadCards(directory) {
        let cards = {};

        let jsonPacks = fs.readdirSync(directory).filter((file) => file.endsWith('.json'));

        for (let file of jsonPacks) {
            let pack = require(path.join(directory, file));

            for (let card of pack.results) {
                cards[card.stub] = card;
            }
        }

        return cards;
    }


    getCard(stub) {
        return this.allCards.find(c => c.stub === stub);
    }

    getPbUniqueCard(name) {
        return this.playableCards.find(c => c.phoenixborn === name);
    }

    getPlayableCard() {
        return this.getRandomCard(this.legalCards);
    }

    getRandomCard(source) {
        const i = Math.floor(Math.random() * (source.length - 1));
        return source[i];
    }
}

module.exports = Forge;