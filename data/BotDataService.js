const monk = require('monk');

class BotDataService {
    constructor() {
        const mongoUrl = process.env.MONGO_URL;
        const db = monk(mongoUrl);

        this.pairings = db.get('pairings');
    }

    async getLatest(tag) {
        return this.pairings.findOne(
            { "tag": tag },
            {
                sort: { _id: -1 },
                limit: 1
            }
        ).catch((err) => {
            console.log('Unable to fetch latest pairings', err);
            throw new Error('Unable to fetch latest pairings ' + id);
        });
    }

    async getPrevious(tag) {
        return this.pairings.find(
            { "tag": tag },
            {
                sort: { _id: -1 },
                limit: 2
            }
        ).catch((err) => {
            console.log('Unable to fetch latest pairings', err);
            throw new Error('Unable to fetch latest pairings ' + id);
        });
    }

    async saveLatest(tag, pairings) {
        this.pairings.insert({
            tag: tag,
            datePaired: new Date(),
            pairings: pairings
        })
    }

    delete(id) {
        return this.decks.remove({ _id: id });
    }

}

module.exports = BotDataService;
