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

        // get legal cards in dice color
        this.legalCards = this.playableCards.filter(card => {
            // allowed dice types only
            return (!card.dice || this.allowedDiceTypes(card.dice, dice)) &&
                // no pb uniques unless it's mine
                (!card.phoenixborn || card.phoenixborn === pbData.name)
        });

        // get 30 cards
        const deckCards = [];
        // add unique if it is allowed in dice types
        const unique = this.getPbUniqueCard(pbData.name);
        if (!unique.dice || this.allowedDiceTypes(unique.dice, dice)) {
            this.addCardToStack(unique, deckCards, 3);
        }

        // draw 30 cards
        while (deckCards.length < 30) {
            let nextCard = this.getPlayableCard();
            // if (deckCards.length === 3) {
            //     nextCard = this.getPlayableCard(c => c.stub === 'summon-emperor-lion');
            // }
            // const nextCard = this.getPlayableCard();
            if (this.cardCanBeAdded(deckCards, nextCard, pbData)) {
                this.addCardToStack(nextCard, deckCards);
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

        // work out dice counts
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

    addCardToStack(card, stack, quantity = 1) {
        const extras = this.getCardExtras(card);
        const amount = extras && extras.quantity ? extras.quantity : quantity;
        for (let i = 0; i < amount; i++) {
            stack.push(card);
        }
        if (extras && extras.also && typeof extras.also === 'function') {
            extras.also(stack)
        }
    }

    cardCanBeAdded(deckCards, nextCard, pbData) {
        if (nextCard.type === 'Ready Spell' && !deckCards.includes(nextCard)) {
            const readySpellCount = _.uniq(deckCards).filter(c => c.type === 'Ready Spell' && !c.name.includes('Law')).length;
            if (readySpellCount > pbData.spellboard) {
                return false;
            }
        }
        if (this.getSpaceNeeded(nextCard) > 30 - deckCards.length) {
            return false;
        }
        return deckCards.filter(c => c === nextCard).length < 3;
    }

    getSpaceNeeded(card) {
        const extras = this.getCardExtras(card);
        if (extras) {
            return extras.spaceNeeded;
        } else
            return 1;
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

    getPlayableCard(filter = undefined) {
        let source = this.legalCards;
        if (filter) {
            source = this.legalCards.filter(filter);
        }
        return this.getRandomCard(source);
    }

    findCards(quantity, filter) {
        const result = [];
        for (let i = 0; i < quantity; i++) {
            result.push(this.getPlayableCard(filter));
        }
        return result;
    }

    getRandomCard(source) {
        const i = Math.floor(Math.random() * (source.length - 1));
        return source[i];
    }

    getCardExtras(card) {
        switch (card.stub) {
            case 'summon-emperor-lion': return ({
                spaceNeeded: 3, also: (stack) => {
                    const laws = this.findCards(2, (card) => card.name.includes('Law'))
                    stack.push(...laws);
                }
            })
            case 'summon-fallen': return ({
                spaceNeeded: 3, quantity: 3
            })
            default:
                return undefined;
        }
    }
}

module.exports = Forge;