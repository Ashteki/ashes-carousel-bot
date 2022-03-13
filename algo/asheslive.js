class AshesLive {
    parseAshesLiveDeckResponse(user, ashesDeck) {
        return {
            username: user.username,
            name: ashesDeck.title,
            phoenixborn: [
                {
                    id: ashesDeck.phoenixborn.stub,
                    count: 1
                }
            ],
            dicepool: ashesDeck.dice.map((d) => ({ magic: d.name, count: d.count })),
            cards: ashesDeck.cards.map((c) => ({ id: c.stub, count: c.count })),
            conjurations: ashesDeck.conjurations.map((c) => ({ id: c.stub, count: c.count })),
            ashesLiveModified: ashesDeck.modified
        };
    }
}

module.exports = AshesLive;