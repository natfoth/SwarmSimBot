declare module SwarmSim {
    export interface IUpgrade {
        game: IGame;
        type: any;
        name: string;
        unit: IUnit;
        costByName: any;
        cost: ICost[];
        requires: any;
        effect: IEffect[];
        $$hashKey: any;
        _init: () => _private;
        count: () => any;
        _setCount: (a) => _private;
        _addCount: (a) => _private;
        _subtractCount: (a) => _private;
        isVisible: () => any;
        _isVisible: () => _private;
        totalCost: () => any;
        _totalCost: (a) => _private;
        sumCost: (a, b) => any;
        isCostMet: () => any;
        maxCostMet: (b) => any;
        isMaxAffordable: () => any;
        costMetPercent: () => any;
        estimateSecsUntilBuyable: (a) => any;
        _estimateSecsUntilBuyable: () => _private;
        isUpgradable: (a, b) => any;
        isAutobuyable: () => any;
        isNewlyUpgradable: (a) => any;
        isBuyable: () => any;
        buy: (b) => any;
        buyMax: (a) => any;
        calcStats: (a, b) => any;
        statistics: () => any;
        _watchedAtDefault: () => _private;
        isManuallyHidden: () => any;
        watchedAt: () => any;
        watchedDivisor: () => any;
        watch: (a) => any;
    }
}