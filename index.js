require('dotenv').config(); //initialize dotenv
const { Client, Intents, MessageEmbed } = require('discord.js');
const Carousel = require('./algo/carousel');
const Forge = require('./algo/forge');
const TextExporter = require('./export/textexporter');

let carousel = new Carousel();
const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS
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
        const lfgRole = msg.guild.roles.cache.find(r => r.name === 'lfg');
        if (!lfgRole) {
            msg.channel.send('no lfg role found');
        }

        if (parts[1] === 'list') {
            const members = lfgRole.members;
            console.log(members.size);
            const memberNames = members.sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)
                .map(m => m.displayName);
            const listEmbed = new MessageEmbed()
                .setTitle('Users who are lfg:')
                .setDescription(memberNames.join('\n'));

            msg.channel.send({ embeds: [listEmbed] });
        }

        if (parts.length === 1 || (parts.length === 2 && parts[1] === 'on')) {
            msg.member.roles.add(lfgRole);
            msg.channel.send(msg.member.displayName + ' added to the @lfg role');
        }
        if ((parts.length === 2 && parts[1] === 'off')) {
            msg.member.roles.remove(lfgRole);
            msg.channel.send(msg.member.displayName + ' lfg off');
        }
    }

    if (parts[0].toLowerCase() === '!ffl') {
        let lfgRole = msg.guild.roles.cache.find(r => r.name === 'first-five-league');
        if (!lfgRole) {
            msg.channel.send('no ffl role found');
        }

        if (parts[1] === 'list') {
            const memberNames = lfgRole.members.sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)
                .map(m => m.displayName);
            const listEmbed = new MessageEmbed()
                .setTitle('Users who are in the league:')
                .setDescription(memberNames.join('\n'));

            msg.channel.send({ embeds: [listEmbed] });
        }

        if (parts[1] === 'pair') {
            const memberNames = lfgRole.members.sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)
                .map(m => m.displayName);
            const pairCount = Math.round(memberNames.length / 2);
            const pairs = memberNames.slice(0, pairCount).map((m) => ({ player1: m }));
            const remainder = memberNames.slice(pairCount);
            pairs.forEach((p) => {
                if (remainder.length) {
                    const randomIndex = Math.floor(Math.random() * remainder.length);
                    const randomPlayer = remainder[randomIndex];
                    p.player2 = randomPlayer;
                    remainder.splice(randomIndex, 1);
                } else {
                    p.player2 = 'BYE';
                }
            })
            const listEmbed = new MessageEmbed()
                .setTitle('Random pairings:')
                .setDescription(pairs.map((p, i) => `${i + 1}. ${p.player1} vs ${p.player2}`).join('\n'));

            msg.channel.send({ embeds: [listEmbed] });
        }

        if (parts.length === 2) {
            if (parts[1] === 'join') {
                msg.member.roles.add(lfgRole);
                msg.channel.send(msg.member.displayName + ' joined the first five league!');
            }
            if (parts[1] === 'drop') {
                msg.member.roles.remove(lfgRole);
                msg.channel.send(msg.member.displayName + ' dropped');
            }
        }
    }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token