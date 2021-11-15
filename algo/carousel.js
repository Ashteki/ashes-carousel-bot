class Carousel {
    constructor() {
        this.pbs = [];
    }

    getCarouselEntry() {
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

        // Returns a random integer from 1 to 10:
        const i = Math.floor(Math.random() * (this.pbs.length - 1));
        const d = [];
        for (let j = 0; j < 3; j++) {
            const dIndex = Math.floor(Math.random() * (dice.length - 1));
            d[j] = dice[dIndex];
            dice = dice.filter((d) => d !== dice[dIndex]);
        }

        const result = this.pbs[i] + ' ' + d.map((dObj) => dObj.icon).join(' ') + ' (' + d.map((dObj) => dObj.text).join('') + ')';
        this.pbs = this.pbs.filter(p => p !== this.pbs[i]);
        return result;
    }

    getPBs() {
        return ['Coal',
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
    }
}

module.exports = Carousel;