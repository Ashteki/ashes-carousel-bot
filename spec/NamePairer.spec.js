const NamePairer = require("../algo/NamePairer");

describe("Pairing tests", function () {
    const pairer = new NamePairer();
    const names = ['alan', 'brian', 'clive', 'daniel', 'emily', 'felix'];
    it("even entries without avoidMatches", function () {
        let pairs = pairer.pair(names)
        console.log(pairs);
        expect(pairs).not.toBeNull();
        expect(pairs.length).toBe(3);
    });

    it("avoid rematching daniel with felix", function () {
        const avoid = [{
            "_id": { "$oid": "63c43a82552274f68fc0dfb0" },
            "tag": "phx",
            "pairingDate": "13-JAN-2023",
            "pairings": [
                { player1: 'daniel', player2: 'felix' }]
        }];

        for (let index = 0; index < 20; index++) {
            const pairs = pairer.pair(names, avoid)
            console.log(pairs);
            expect(pairs).not.toBeNull();
            expect(pairs.length).toBe(3);
            expect(pairs.some((p) => p.player1 === 'daniel' && p.player2 === 'felix')).toBe(false);
            expect(pairs.some((p) => p.player2 === 'daniel' && p.player1 === 'felix')).toBe(false);
        }
    });
});