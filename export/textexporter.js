class TextExporter {
    export(deck) {
        let result = '**' + deck.phoenixborn.name + '**\n';
        deck.dice.forEach(d => {
            result += d.count + ' ' + d.name + '\n';
        })
        deck.cards.sort((a, b) => a.card.type > b.card.type ? 0 : -1);
        let cardType = '';
        deck.cards.forEach(c => {
            if (cardType !== c.card.type) {
                result += '**' + c.card.type + '**\n';
                cardType = c.card.type;
            }
            result += c.count + ' ' + c.card.name + '\n';
        });

        return result;
    }
}

module.exports = TextExporter;