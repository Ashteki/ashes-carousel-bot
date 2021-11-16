class TextExporter {
    export(deck) {
        let result = deck.phoenixborn.name + '\n';
        result += 'dice:\n';
        deck.dice.forEach(d => {
            result += d.count + ' ' + d.name + '\n';
        })
        result += 'cards:\n';
        deck.cards.forEach(card => {
            result += card.count + ' ' + card.card.name + '\n';
        });
        return result;
    }
}

module.exports = TextExporter;