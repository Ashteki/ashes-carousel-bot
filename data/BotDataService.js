const monk = require('monk');

class BotDataService {
    constructor() {
        const mongoUrl = process.env.MONGO_URL;
        const db = monk(mongoUrl);

        this.pairings = db.get('pairings');
        this.nameLinks = db.get('namelinks');
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

    async getPrevious(tag, amount) {
        return this.pairings.find(
            { "tag": tag },
            {
                sort: { _id: -1 },
                limit: amount
            }
        ).catch((err) => {
            console.log('Unable to fetch latest 2 pairings', err);
            throw new Error('Unable to fetch latest 2 pairings ' + id);
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

    async getNameLinkByAshtekiName(ashtekiName) {
        return this.nameLinks.findOne(
            { "ashtekiName": ashtekiName },
            {
                sort: { _id: -1 },
                limit: 1
            }
        ).catch((err) => {
            console.log('Unable to get namelinks', err);
            throw new Error('Unable to get namelinks ' + ashtekiName);
        });
    }

    async getNameLinkByDiscordName(discordName) {
        return this.nameLinks.findOne(
            { "discordName": discordName },
            {
                sort: { _id: -1 },
                limit: 1
            }
        ).catch((err) => {
            console.log('Unable to get namelinks', err);
            throw new Error('Unable to get namelinks ' + discordName);
        });
    }

    async insertNameLink(discordName, ashtekiName) {
        this.nameLinks.insert({
            discordName: discordName,
            ashtekiName: ashtekiName
        })
    }

    async updateNameLink(discordName, ashtekiName) {
        return this.nameLinks.update({ discordName: discordName }, { $set: { ashtekiName: ashtekiName } }).catch((err) => {
            logger.error('Error setting name link', err);
            throw new Error('Error setting name link');
        });
    }

}

module.exports = BotDataService;
