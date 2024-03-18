const uuid = require('uuid');

class NamePairer {

    pair(names, previousPairings = []) {

        let sampleSize = 10;
        let oldestPairing = new Date(Date.now());
        for (let i = 0; i < previousPairings.length; i++) {
            if (oldestPairing > new Date(previousPairings[i].pairingDate)) {
                oldestPairing = new Date(previousPairings[i].pairingDate);
            }
        }

        const pairingsAdjusted = previousPairings.map((m) => {
            return m.pairings.map((n) => {
                return {
                    "date": m.datePaired,
                    "p1": n.player1,
                    "p2": n.player2
                }
            });
        }).flat(1);

        let bestPairing = { "score": 0, "pairing": [] };
        for (let i = 0; i < sampleSize; i++) {
            let newPairing = this.createRandomPairing(names, pairingsAdjusted, oldestPairing);
            if (bestPairing.score < newPairing.score) {
                bestPairing = newPairing;
            }
        }
        return bestPairing.pairing;
    }

    createRandomPairing(names, previousPairings, oldestPairing) {
        let score = 0;
        let pairing = this.makePairs(names);
        score = this.scorePairing(pairing, previousPairings, oldestPairing);
        return { "score": score, "pairing": pairing };
    }

    scorePairing(pairing, previousPairings, oldestPairing) {
        let score = 0;
        for (let i = 0; i < pairing.length; i++) {
            let pairScore = 0;
            for (let j = 0; j < previousPairings.length; j++) {
                if ((previousPairings[j].p1 === pairing[i].player1 && previousPairings[j].p2 === pairing[i].player2)
                    || (previousPairings[j].p1 === pairing[i].player2 && previousPairings[j].p2 === pairing[i].player1)) {
                    pairScore += this.weeksDiff(new Date(previousPairings[j].date), new Date(Date.now()));//this multicasting is stupid but 
                    break;
                }
            }
            if (pairScore === 0) {
                pairScore = (this.weeksDiff(oldestPairing, new Date(Date.now())) + 1);
            }
            score += pairScore;
        }

        return score;
    }

    weeksDiff(date1, date2) {
        let Difference_In_Time = date2.getTime() - date1.getTime();
        return Math.round(Difference_In_Time / (1000 * 3600 * 24 * 7));
    }

    makePairs(names) {
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
                p.player2 = "BYE";
            }
        });

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
}

module.exports = NamePairer;