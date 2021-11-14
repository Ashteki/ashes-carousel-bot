require('dotenv').config(); //initialize dotenv
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const parts = msg.content.split(' ');
    if (parts[0] === '!carousel') {
        if (parts.length === 1) {
            // single nameless carousel return
            msg.reply(getCarousel());
        }
        else {
            let reply = '';
            for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                reply += part + ': ' + getCarousel() + '\n';
            }
            msg.reply(reply);
        }
    }
});

function getCarousel() {
    const pbs = ['Coal',
        'Aradel',
        'Maeoni',
        'Jessa',
        'Noah',
        'Saria',
        'Rin',
        'Victoria',
        'Brennen',
        'Leo',
        'Odette',
        'Namine',
        'Jericho',
        'Echo',
        'Koji',
        'Harold',
        'James',
        'Astrea',
        'Sembali',
        'Fiona',
        'Xander',
        'Rimea',
        'Orrick',
        'Lulu'
    ];
    let dice = [
        { icon: '<:np:408070378443898881>', text: 'N' },
        { icon: '<:cp:408070378393567282>', text: 'C' },
        { icon: '<:hp:408070378393567272>', text: 'H' },
        { icon: '<:ip:408070378288840705>', text: 'I' },
        { icon: '<:dp:408070378338910210>', text: 'D' },
        { icon: '<:sp:408070378729242634>', text: 'S' },
        { icon: '<:tp:835365094253789206>', text: 'T' }
    ];

    // Returns a random integer from 1 to 10:
    const i = Math.floor(Math.random() * (pbs.length - 1));
    const d = [];
    for (let j = 0; j < 3; j++) {
        const dIndex = Math.floor(Math.random() * (dice.length - 1));
        d[j] = dice[dIndex];
        dice = dice.filter((d) => d !== dice[dIndex]);
    }

    return pbs[i] + ' ' + d.map((dObj) => dObj.icon).join(' ') + ' (' + d.map((dObj) => dObj.text).join('') + ')';
}

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token