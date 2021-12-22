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

    if (parts[0] === '!coaloff') {
        const caro = carousel.getCarousel('coal-roarkwin');
        const diceString = caro.dice.map((dObj) => dObj.text).join('');
        const deck = new Forge().createDeck(caro.pb.stub, diceString, { maxCardCount: 1, noExtras: true });
        const deckText = new TextExporter().export(deck);
        msg.reply(deckText);
    }

    if (parts[0] === '!lfg') {
        if (parts.length === 1 || (parts.length === 2 && parts[1] === 'on')) {
            const lfgRole = msg.guild.roles.cache.find(r => r.name === 'lfg');
            msg.member.roles.add(lfgRole);
            msg.channel.send(`${lfgRole} ${msg.author.username} is looking for a game!`);
        }
        if ((parts.length === 2 && parts[1] === 'off')) {
            const lfgRole = msg.guild.roles.cache.find(r => r.name === 'lfg');
            msg.member.roles.remove(lfgRole);
            msg.channel.send(msg.author.username + ' lfg off');
        }
    }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token