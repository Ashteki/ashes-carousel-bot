require('dotenv').config(); //initialize dotenv
const { Client, Intents } = require('discord.js');
const Carousel = require('./algo/carousel');
const Forge = require('./algo/forge');
const TextExporter = require('./export/textexporter');

let carousel = new Carousel();
const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    partials: ['MESSAGE', 'CHANNEL']
});
// put the pb names here

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const parts = msg.content.split(' ');
    // only response if carousel is requested
    if (['!carousel', '!car'].includes(parts[0])) {
        if (parts.length === 1) {
            // single nameless carousel return
            msg.reply(carousel.getCarouselEntry());
        }
        else {
            // bulk request
            let reply = '';
            for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                reply += part + ': ' + carousel.getCarouselEntry() + '\n';
                if (reply.length > 1950) {
                    msg.reply(reply);
                    reply = '';
                }
            }
            msg.reply(reply);
        }
    }

    if (parts[0] === '!rando') {
        const caro = carousel.getCarousel();
        const diceString = caro.dice.map((dObj) => dObj.text).join('');
        const deckText = new TextExporter().export(new Forge().createDeck(caro.pb.stub, diceString));
        msg.reply(deckText);
    }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token