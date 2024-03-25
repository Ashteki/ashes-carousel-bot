require('dotenv').config(); //initialize dotenv
const { Client, GatewayIntentBits, Partials, Events, EmbedBuilder } = require('discord.js');
const AshesLive = require('./algo/asheslive');
const Carousel = require('./algo/carousel');
const Forge = require('./algo/forge');
const NamePairer = require('./algo/NamePairer');
const Validator = require('./algo/validator');
const BotDataService = require('./data/BotDataService');
const TextExporter = require('./export/textexporter');
const util = require('./util');
const AshesLiveHelper = require('./algo/AshesLiveHelper');


let carousel = new Carousel();
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async msg => {
    if (msg.content[0] !== '!') {
        const regex = /\[[\w\s]+\]/;
        let cardSearch = msg.content.match(regex);
        if (cardSearch) {
            await doCardLookup(cardSearch, msg);
        }
        return;
    }

    const parts = msg.content.split(' ');
    let command = null;
    if (parts.length > 0 && parts[0].length > 0) {
        command = parts[0].slice(1).toLocaleLowerCase();
    }

    if (parts[0] === '!c') {
        await doCardLookup(msg.content.substring(3), msg);
        return;
    }

    // only response if carousel is requested
    if (['!carousel', '!car'].includes(parts[0])) {
        doCarouselResponse(parts, msg);
        return;
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

    if (parts[0] === '!link') {
        // update a user's ashteki name
        const ashtekiName = parts[1];
        if (!ashtekiName) {
            const myNameLink = await getMyNameLink(msg.member.displayName);
            if (myNameLink) {
                msg.channel.send(`Your discord name is linked to ${myNameLink.ashtekiName}`);
            } else {
                msg.channel.send(`Your discord name is not linked`);
            }
            return;
        }
        // 1. check if ashteki name is in use
        doLinkAction(ashtekiName, msg);
        return;
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
            const listEmbed = new EmbedBuilder()
                .setTitle(`Players who are lfg (${memberNames.length}):`)
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
    const roleNames = {
        ffl: 'first-five-league',
        phx: 'phoenix-league'
    }

    // check for role command
    if (Object.keys(roleNames).includes(command)) {
        let discordRole = msg.guild.roles.cache.find(r => r.name === roleNames[command]);
        if (!discordRole) {
            msg.channel.send('role not found: ' + command);
            return;
        }

        if (parts.length > 1) {
            const action = parts[1];

            if (action === 'list') {
                const memberNames = discordRole.members.sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)
                    .map(m => m.displayName);
                const listEmbed = new EmbedBuilder()
                    .setTitle(`Players in the league (${memberNames.length}):`)
                    .setDescription(memberNames.join('\n'));

                msg.channel.send({ embeds: [listEmbed] });
            }

            if (action === 'pair') {
                try {
                    const dataService = new BotDataService();
                    const latest = await dataService.getLatest(command);
                    const previousTen = await dataService.getPrevious(command, 10);

                    const memberNames = discordRole.members.sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)
                        .map(m => m.displayName);
                    const pairer = new NamePairer();
                    const pairs = pairer.pair(memberNames, previousTen);

                    if (pairs?.length) {
                        dataService.saveLatest(command, pairs);

                        const listEmbed = new EmbedBuilder()
                            .setTitle('Random pairings:')
                            .setDescription(pairs.map((p, i) => `${i + 1}. ${p.player1} vs ${p.player2}`).join('\n'));

                        msg.channel.send({ embeds: [listEmbed] });
                    } else {
                        msg.channel.send('unable to pair: null pairing returned from pairer');

                    }
                } catch (e) {
                    console.log('error', e);

                    msg.channel.send('unable to pair due to error:', e.message);
                }
            }

            if (action === 'latest') {
                try {
                    const dataService = new BotDataService();
                    const latest = await dataService.getLatest(command);

                    const listEmbed = new EmbedBuilder()
                        .setTitle(command + ' latest:')
                        .setDescription(latest.datePaired + '\n' + latest.pairings.map((p, i) => `${i + 1}. ${p.player1} vs ${p.player2}`).join('\n'));

                    msg.channel.send({ embeds: [listEmbed] });
                } catch (e) {
                    console.log('error', e);

                    msg.channel.send('unable to get latest due to error:', e.message);
                }
            }

            if (action === 'previous') {
                try {
                    const dataService = new BotDataService();
                    const latestTwo = await dataService.getPrevious(command);

                    if (latestTwo.length === 2) {
                        latest = latestTwo[1];

                        const listEmbed = new EmbedBuilder()
                            .setTitle(command + ' previous:')
                            .setDescription(latest.datePaired + '\n' + latest.pairings.map((p, i) => `${i + 1}. ${p.player1} vs ${p.player2}`).join('\n'));

                        msg.channel.send({ embeds: [listEmbed] });
                    } else {
                        msg.channel.send('not found');
                    }
                } catch (e) {
                    console.log('error', e);

                    msg.channel.send('unable to get latest due to error:', e.message);
                }
            }

            if (action === 'join') {
                msg.member.roles.add(discordRole);
                msg.channel.send(msg.member.displayName + ' joined ' + roleNames[command] + '!');
            }
            if (action === 'drop') {
                msg.member.roles.remove(discordRole);
                msg.channel.send(msg.member.displayName + ' left ' + roleNames[command]);
            }
        }
    }

    if (['!trinity', '!tri'].includes(parts[0])) {
        const deckUrl = parts[1];
        const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        let uuid = deckUrl.match(regex);
        try {
            let response = await util.httpRequest(`https://api.ashes.live/v2/decks/shared/${uuid}`);

            if (response[0] === '<') {
                logger.error('Deck failed to download: %s %s', deck.uuid, response);

                throw new Error('Invalid response from api. Please try again later.');
            }

            deckResponse = JSON.parse(response);
        } catch (error) {
            logger.error(`Unable to get deck ${deck.uuid}`, error);

            throw new Error('Invalid response from Api. Please try again later.');
        }

        if (!deckResponse || !deckResponse.cards) {
            throw new Error('Invalid response from Api. Please try again later.');
        }

        let newDeck = new AshesLive().parseAshesLiveDeckResponse('user', deckResponse);
        const res = new Validator().validateTrinityDeck(newDeck)
        let header = newDeck.name + ' is ';
        header += !res.valid ? 'not ' : '';
        header += 'valid for trinity format:\n'
        let message = 'Master Set: ';
        message += res.core ? 'Yes\n' : 'No\n';
        message += 'Deluxe: ' + res.deluxe.join(', ') + '\n';
        message += `Packs (${res.packs.length}): ` + res.packs.join(', ') + '\n';
        const listEmbed = new EmbedBuilder()
            .setTitle(header)
            .setDescription(message);

        msg.channel.send({ embeds: [listEmbed] });
    }
});

async function doCardLookup(searchText, msg) {
    const ashesLiveHelper = new AshesLiveHelper;
    const cardDetails = await ashesLiveHelper.findCard(searchText);
    if (cardDetails?.imageUrl) {
        msg.channel.send(cardDetails.imageUrl);
    }
}

function doCarouselResponse(parts, msg) {
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

async function getMyNameLink(name) {
    const dataService = new BotDataService();
    return await dataService.getNameLinkByDiscordName(name);
}

async function doLinkAction(ashtekiName, msg) {
    const dataService = new BotDataService();
    const targetNameLink = await dataService.getNameLinkByAshtekiName(ashtekiName);
    if (targetNameLink) {
        msg.channel.send(`Ashteki name ${ashtekiName} is already linked to ${targetNameLink.discordName}`);
    } else {
        const myNameLink = await dataService.getNameLinkByDiscordName(msg.member.displayName);
        if (myNameLink) {
            await dataService.updateNameLink(msg.member.displayName, ashtekiName);
            msg.channel.send(`Your discord name is now linked to ${ashtekiName}`);
        } else {
            dataService.insertNameLink(msg.member.displayName, ashtekiName);
            msg.channel.send(`Added link: ${ashtekiName} to ${msg.member.displayName}`);
        }
    }
}


//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
