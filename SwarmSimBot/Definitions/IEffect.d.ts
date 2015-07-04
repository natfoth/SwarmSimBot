declare module SwarmSim {
    export interface IEffect {
        game: IGame;
        parent: any;
        stat: any;
        type: any;
        unittype: any;
        val: any;
        val2: any;
        unit: IUnit;
        parentUnit: () => any;
        parentUpgrade: () => any;
        hasParentStat: (a, b) => any;
        parentStat: (a, b) => any;
        onBuy: (a) => any;
        calcStats: (a, b, c) => any;
        bank: () => any;
        cap: () => any;
        output: (a) => any;
        outputNext: () => any;
        power: () => any;
    }
}