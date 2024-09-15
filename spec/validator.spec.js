const Validator = require('../algo/validator');

describe("Validator tests", function () {
    const validator = new Validator();
    it("validate catspill deck", function () {
        const deck = {
            "precon_id": 416,
            "name": "The Siege of Lordswall: Dimona",
            "phoenixborn": [
                {
                    "id": "dimona-odinstar",
                    "count": 1
                }
            ],
            "ultimate": null,
            "behaviour": null,
            "dicepool": [
                {
                    "magic": "divine",
                    "count": 10
                }
            ],
            "cards": [
                {
                    "id": "take-to-the-skies",
                    "count": 3
                },
                {
                    "id": "glory-aspirant",
                    "count": 3
                },
                {
                    "id": "silver-paladin",
                    "count": 3
                },
                {
                    "id": "radiant-light",
                    "count": 3
                },
                {
                    "id": "summon-shining-stag-mount",
                    "count": 3
                },
                {
                    "id": "ptera-herder",
                    "count": 3
                },
                {
                    "id": "hand-of-spear",
                    "count": 3
                },
                {
                    "id": "pride",
                    "count": 3
                },
                {
                    "id": "fork-lightning",
                    "count": 3
                },
                {
                    "id": "intercession",
                    "count": 3
                }
            ],
            "conjurations": [
                {
                    "id": "shining-stag-mount",
                    "count": 3
                },
                {
                    "id": "ptera-hatchling",
                    "count": 3
                },
                {
                    "id": "hand-of-shield",
                    "count": 1
                },
                {
                    "id": "empyrean-mount",
                    "count": 3
                },
                {
                    "id": "divinity-mount",
                    "count": 1
                }
            ]
        };

        let result = validator.validateCatSpill(deck);
        console.log(result);
        expect(result).not.toBeNull();
        expect(result.valid).toBeFalse();
    });

    it("validate RRHL2 deck (valid)", function () {
        const deck = {
            "name": "The Iron Men",
            "phoenixborn": [
                {
                    "id": "coal-roarkwin",
                    "count": 1
                }
            ],
            "dicepool": [
                {
                    "magic": "natural",
                    "count": 5
                },
                {
                    "magic": "ceremonial",
                    "count": 5
                }
            ],
            "cards": [
                {
                    "id": "expand-energy",
                    "count": 2
                },
                {
                    "id": "strengthen",
                    "count": 1,
                    "ff": true
                },
                {
                    "id": "channel-magic",
                    "count": 3,
                    "ff": true
                },
                {
                    "id": "regress",
                    "count": 3
                },
                {
                    "id": "chant-of-revenge",
                    "count": 2,
                    "ff": true
                },
                {
                    "id": "summon-iron-rhino",
                    "count": 3
                },
                {
                    "id": "final-stand",
                    "count": 1
                },
                {
                    "id": "fester",
                    "count": 3,
                    "ff": true
                },
                {
                    "id": "iron-worker",
                    "count": 3,
                    "ff": true
                },
                {
                    "id": "hammer-knight",
                    "count": 3,
                    "ff": true
                },
                {
                    "id": "one-hundred-blades",
                    "count": 3
                },
                {
                    "id": "close-combat",
                    "count": 1
                },
                {
                    "id": "silver-paladin",
                    "count": 2
                },

            ],
            "conjurations": [
                {
                    "id": "iron-rhino",
                    "count": 1
                }
            ]
        };

        let result = validator.validateRedRainsHeroicLevel2(deck);
        console.log(result);
        expect(result).not.toBeNull();
        expect(result.channelMagic).toBe(3);
        expect(result.pbPrecon.name).toBe('The Iron Men');
        expect(result.valid).toBeTrue();
    });

    it("validate RedRains Precon deck (valid)", function () {
        const deck = {
            "name": "The Siege of Lordswall: Dimona",
            "phoenixborn": [
                {
                    "id": "dimona-odinstar",
                    "count": 1
                }
            ],
            "ultimate": null,
            "behaviour": null,
            "dicepool": [
                {
                    "magic": "divine",
                    "count": 10
                }
            ],
            "cards": [
                {
                    "id": "take-to-the-skies",
                    "count": 3
                },
                {
                    "id": "glory-aspirant",
                    "count": 3
                },
                {
                    "id": "silver-paladin",
                    "count": 3
                },
                {
                    "id": "radiant-light",
                    "count": 3
                },
                {
                    "id": "summon-shining-stag-mount",
                    "count": 3
                },
                {
                    "id": "ptera-herder",
                    "count": 3
                },
                {
                    "id": "hand-of-spear",
                    "count": 3
                },
                {
                    "id": "pride",
                    "count": 3
                },
                {
                    "id": "fork-lightning",
                    "count": 3
                },
                {
                    "id": "intercession",
                    "count": 3
                }
            ],
            "conjurations": [
                {
                    "id": "shining-stag-mount",
                    "count": 3
                },
                {
                    "id": "ptera-hatchling",
                    "count": 3
                },
                {
                    "id": "hand-of-shield",
                    "count": 1
                },
                {
                    "id": "empyrean-mount",
                    "count": 3
                },
                {
                    "id": "divinity-mount",
                    "count": 1
                }
            ]
        };

        let result = validator.validateRedRainsHeroicLevel2(deck);
        console.log(result);
        expect(result).not.toBeNull();
        expect(result.pbPrecon.name).toBe('The Siege of Lordswall: Dimona');
        expect(result.valid).toBeTrue();
    });
});

