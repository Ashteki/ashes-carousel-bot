const fs = require('fs');
const path = require('path');
const PathToSubModulePacks = path.join(__dirname, '../data');

class Validator {
    constructor() {
        this.cardsByCode = this.loadCards(PathToSubModulePacks);
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


    validateTrinityDeck(deck) {
        const result = {
            valid: null,
            core: false,
            deluxe: [],
            packs: []
        }
        deck.cards.forEach(c => {
            const card = this.cardsByCode[c.id];
            const release = card.release.name;
            if (release === 'Master Set') {
                result.core = true;
            } else {

                if (['The Song of Soaksend', 'The Law of Lions', 'The Breaker of Fate'].includes(release)) {
                    if (!result.deluxe.includes(release)) {
                        result.deluxe.push(release);
                    }
                } else {
                    if (!result.packs.includes(release)) {
                        result.packs.push(release);
                    }
                }
            }
        });
        result.valid = result.deluxe.length < 2 && result.packs.length < 4;
        return result;
    }
}

module.exports = Validator;