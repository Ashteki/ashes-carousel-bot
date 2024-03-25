const util = require('../util');

class AshesLiveHelper {
    async findCard(searchText) {
        let searchResponse = null;
        try {
            let response = await util.httpRequest(`https://api.ashes.live/v2/cards?q=${searchText}&sort=type`);

            if (response[0] !== '{') {
                logger.error('Failed to query ashes.live: %s %s', searchText, response);

                throw new Error('Invalid response from api. Please try again later.');
            }

            searchResponse = JSON.parse(response);
        } catch (error) {
            logger.error(`Unable to get deck ${deck.uuid}`, error);

            throw new Error('Invalid response from Api. Please try again later.');
        }

        if (searchResponse?.count > 0) {
            const firstMatch = searchResponse.results[0];

            return {
                imageUrl: `https://cdn.ashes.live/images/cards/${firstMatch.stub}.jpg`,
                url: `https://ashes.live/cards/${firstMatch.stub}`
            }
        } else {
            return null;
        }
    }
}

module.exports = AshesLiveHelper;