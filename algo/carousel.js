class Carousel {
    constructor() {
        this.pbs = [];
    }

    getCarouselEntry() {
        const caro = this.getCarousel();
        const diceIcons = caro.dice.map((dObj) => dObj.icon).join(' ');
        return caro.pb.name + ' ' + diceIcons + ' (' + caro.dice.map((dObj) => dObj.text).join('') + ')';
    }

    getCarousel(pbStub = null) {
        if (this.pbs.length === 0) {
            this.pbs.push(...this.getPBs());
        }
        let dice = [
            { icon: '<:np:408070378443898881>', text: 'N' },
            { icon: '<:cp:408070378393567282>', text: 'C' },
            { icon: '<:hp:408070378393567272>', text: 'H' },
            { icon: '<:ip:408070378288840705>', text: 'I' },
            { icon: '<:dp:408070378338910210>', text: 'D' },
            { icon: '<:sp:408070378729242634>', text: 'S' },
            { icon: '<:tp:835365094253789206>', text: 'T' }
        ];

        let pb = null;
        if (pbStub) {
            pb = this.pbs.find(pb => pb.stub === pbStub)
        }
        if (!pb) {
            // Returns a random integer from 1 to pb count:
            const i = Math.floor(Math.random() * (this.pbs.length));
            pb = this.pbs[i];
        }

        const d = [];
        for (let j = 0; j < 3; j++) {
            const dIndex = Math.floor(Math.random() * (dice.length));
            d[j] = dice[dIndex];
            dice = dice.filter((d) => d !== dice[dIndex]);
        }

        const caro = {
            pb: pb,
            dice: d
        }

        // don't remove for coal-off
        if (!pbStub) {
            this.pbs = this.pbs.filter((p) => p !== caro.pb);
        }

        return caro;
    }

    getPBs() {
        return [
            { stub: 'coal-roarkwin', name: 'Coal' },
            { stub: 'aradel-summergaard', name: 'Aradel' },
            { stub: 'maeoni-viper', name: 'Maeoni' },
            { stub: 'jessa-na-ni', name: 'Jessa' },
            { stub: 'noah-redmoon', name: 'Noah' },
            { stub: 'saria-guideman', name: 'Saria' },
            { stub: 'rin-northfell', name: 'Rin' },
            { stub: 'victoria-glassfire', name: 'Victoria' },
            { stub: 'brennen-blackcloud', name: 'Brennen' },
            { stub: 'leo-sunshadow', name: 'Leo' },
            { stub: 'odette-diamondcrest', name: 'Odette' },
            { stub: 'namine-hymntide', name: 'Namine' },
            { stub: 'jericho-reborn', name: 'Jericho' },
            { stub: 'echo-greystorm', name: 'Echo' },
            { stub: 'koji-wolfcub', name: 'Koji' },
            { stub: 'harold-westraven', name: 'Harold' },
            { stub: 'james-endersight', name: 'James' },
            { stub: 'astrea', name: 'Astrea' },
            { stub: 'sembali-grimtongue', name: 'Sembali' },
            { stub: 'fiona-mercywind', name: 'Fiona' },
            { stub: 'xander-heartsblood', name: 'Xander' },
            { stub: 'rimea-careworn', name: 'Rimea' },
            { stub: 'orrick-gilstream', name: 'Orrick' },
            { stub: 'lulu-firststone', name: 'Lulu' }
        ];
    }
}

module.exports = Carousel;