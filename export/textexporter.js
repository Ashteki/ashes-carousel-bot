class TextExporter {
    export(deck) {
        let result = deck.phoenixborn.name + '\n';
        result += 'dice:\n';
        deck.dice.forEach(d => {
            result += d.count + ' ' + d.name + '\n';
        })
        result += 'cards:\n';
        deck.cards.sort((a, b) => a.card.type > b.card.type ? 0 : -1)
        deck.cards.forEach(card => {
            result += card.count + ' ' + card.card.name + '\n';
        });
        return result;
    }
}

module.exports = TextExporter;