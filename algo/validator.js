const fs = require('fs');
const path = require('path');
const PathToCardData = path.join(__dirname, '../data/cards');
const PathToPreconData = path.join(__dirname, '../data/precons');
const catSpill = require('../data/catspill.json');

class Validator {
    constructor() {
        this.cardsByCode = this.loadCards(PathToCardData);
        this.precons = this.loadPrecons(PathToPreconData);
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

    loadPrecons(directory) {
        let precons = {};

        let jsonPacks = fs.readdirSync(directory).filter((file) => file.endsWith('.json'));

        for (let file of jsonPacks) {
            let pack = require(path.join(directory, file));

            for (let precon of pack) {
                precons[precon.name] = precon;
            }
        }

        return precons;
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

    validateCatSpill(deck) {
        const result = {
            valid: true,
            banned: [],
            partial: []
        };
        const cats = catSpill;
        deck.cards.forEach(c => {
            if (catSpill.banned.includes(c.id)) {
                result.banned.push(c.id);
                result.valid = false;
            };

            if (catSpill.partial.includes(c.id)) {
                let entry = result.partial.find(e => e.id === c.id);
                if (!entry) {
                    entry = { id: c.id, count: 0 };
                    result.partial.push(entry);
                }
                entry.count++;
                if (entry.count > 1) {
                    result.valid = false;
                }
            }
        });


        return result;
    }

    validateRedRainsHeroicLevel2(deck) {
        const result = {
            pbPrecon: '',
            channelMagic: 0,
            valid: null,
            precons: []
        }
        // count non-pb and non-uniques by precon (exclude channel magic)
        deck.cards.forEach(c => {
            if (c.id === 'channel-magic') {
                result.channelMagic = c.count;
            } else {
                const card = this.cardsByCode[c.id];
                if (!card.phoenixborn) {
                    const precon = this.findCardPrecon(card);
                    const resPrecon = result.precons.find(p => p.name === precon.name)
                    if (resPrecon) {
                        resPrecon.count++;
                    } else {
                        result.precons.push({ name: precon.name, count: 1, deck: precon });
                    }
                }
            }
        });

        /*
            precon = 9 cards, 1/2 unique, 1 pb
            channel magic   -> 8-9c 1/2u 1pb
            heroic switch   -> 7-9c 1/2u 1pb
                            -> 0-1c
            Level 2
            may replace 3x3 => 4-9c 1/2u 1pb
                            -> 0-1c
                            -> 1-4c

            Rules
            unique must belong to pb
            pb must match precon with 4+
            precon count is max 3. base, heroic switch, L2 sub 
        */

        // get the precon with the most cards and belonging to the pb
        result.pbPrecon = result.precons
            .filter(p => p.deck.phoenixborn[0].id === deck.phoenixborn[0].id || p.deck.precon_set)
            .reduce(
                (prev, current) => {
                    return prev?.count > current.count ? prev : current
                },
                null
            );

        // if pbs don't match then replace with pb deck from set (red Rains)
        if (result.pbPrecon.deck.phoenixborn[0].id !== deck.phoenixborn[0].id
            && result.pbPrecon.deck.precon_set) {
            const matchingPrecon = this.findPbPreconFromSet(deck.phoenixborn[0].id, result.pbPrecon.deck.precon_set);
            result.pbPrecon.name = matchingPrecon.name;
            result.pbPrecon.deck = matchingPrecon;
        }

        result.valid = result.pbPrecon
            && result.precons.length <= 3
            && this.heroicCheck(result)
            && result.pbPrecon?.count > 3; // must be 4+ cards left in the base precon
        return result;
    }

    heroicCheck(result) {
        if (result.precons.length === 3) {
            // if you have 3 precons (base, heroic and L2) then the heroic must be a singleton
            return result.precons.some(p => p.count === 1)
        }

        return true;
    }

    findCardPrecon(card) {
        const precons = Object.values(this.precons);
        return precons.find(p => p.cards.some(c => c.id === card.stub))
    }

    findPbPreconFromSet(pbId, preconSet) {
        const precons = Object.values(this.precons);
        return precons.find(p => p.precon_set === preconSet
            && p.phoenixborn[0].id === pbId)

    }
}

module.exports = Validator;