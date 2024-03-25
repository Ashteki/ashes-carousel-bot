const util = require('../util');

class AshesLiveHelper {
    async findCard(searchText) {
        let searchResponse = null;
        try {
            let response = await util.httpRequest(`https://api.ashes.live/v2/cards/fuzzy-lookup?q=${searchText}`);

            if (response[0] !== '{') {
                console.log('Failed to query ashes.live: %s %s', searchText, response);

                throw new Error('Invalid response from api. Please try again later.');
            }

            searchResponse = JSON.parse(response);
        } catch (error) {
            console.log(`Unable to get card ${searchResponse}`, error);

            throw new Error('Invalid response from Api. Please try again later.');
        }

        if (searchResponse.stub) {
            return {
                name: searchResponse.name,
                imageUrl: `https://cdn.ashes.live/images/cards/${searchResponse.stub}.jpg`,
                url: `https://ashes.live/cards/${searchResponse.stub}`
            }
        } else {
            return null;
        }
    }
}

module.exports = AshesLiveHelper;