const uuid = require('uuid');

class NamePairer {
    pair(names, avoidMatches = []) {
        const namesCopy = [...names];
        const pairCount = Math.round(namesCopy.length / 2);
        const pairs = [];
        for (let i = 0; i < pairCount; i++) {
            const p1 = this.takeOne(namesCopy);
            pairs.push({ player1: p1 });
        }
        pairs.forEach((p) => {
            if (namesCopy.length) {
                p.player2 = this.takeOne(namesCopy);
            } else {
                p.player2 = 'BYE';
            }
        })

        // re-pair check
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            const avoid = this.getAvoidName(avoidMatches, pair.player1);
            if (avoid === pair.player2) {
                if (i > 0) {
                    // swap with record 1
                    pair.player2 = pairs[0].player2;
                    pairs[0].player2 = avoid;
                }
                if (i === 0 && pairs.length > 1) {
                    // swap with record 2 if on first record
                    pair.player2 = pairs[1].player2;
                    pairs[1].player2 = avoid;
                }
                // can't re-pair only one pair
            }
        }

        pairs.forEach((p) => p.id = uuid.v1());

        return pairs;
    }

    takeOne(array, avoid = '') {
        if (!array.length) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * array.length);
        const randomItem = array[randomIndex];

        // success
        array.splice(randomIndex, 1);
        return randomItem;
    }

    getAvoidName(avoidMatches, player) {
        const match = avoidMatches.find((m) => m.player1 === player || m.player2 === player);
        if (!match) {
            return '';
        }
        return match.player1 === player ? match.player2 : match.player1;
    }
}

module.exports = NamePairer;