declare module SwarmSim {
    export interface IUnit {
        game: IGame;
        unittype: any;
        name: string;
        suffix: any;
        affectedBy: any;
        type: any;
        prod: any;
        prodByName: any;
        cost: ICost[];
        costByName: any;
        warnfirst: any;
        showparent: any;
        upgrades: any;
        requires: any;
        cap: any;
        effect: IEffect[];
        tab: any;
        _producerPath: _private;
        _init: () => _private;
        _init2: () => _private;
        isCountInitialized: () => boolean;
        rawCount: () => any;
        _setCount: (a) => _private;
        _addCount: (a) => _private;
        _subtractCount: (a) => _private;
        _parents: () => _private;
        _getCap: () => _private;
        capValue: (a) => any;
        capPercent: () => any;
        capDurationSeconds: () => any;
        capDurationMoment: () => any;
        isEstimateExact: () => boolean;
        isEstimateCacheable: () => boolean;
        estimateSecsUntilEarned: (a) => any;
        estimateSecsUntilEarnedBisection: (a, c) => any;
        count: () => any;
        _countInSecsFromNow: (a) => _private;
        _countInSecsFromReified: (a) => _private;
        spentResources: () => any;
        spent: (a) => any;
        _costMetPercent: () => _private;
        _costMetPercentOfVelocity: () => _private;
        isVisible: () => boolean;
        _isVisible: () => _private;
        isBuyButtonVisible: () => boolean;
        maxCostMet: (a) => any;
        maxCostMetOfVelocity: () => any;
        maxCostMetOfVelocityReciprocal: () => any;
        isCostMet: () => boolean;
        isBuyable: (count?: number) => boolean;
        buyMax: (a) => any;
        twinMult: () => any;
        buy: (a) => any;
        isNewlyUpgradable: () => boolean;
        totalProduction: () => any;
        eachProduction: () => any;
        eachCost: () => any;
        velocity: () => any;
        isVelocityConstant: () => boolean;
        hasStat: (a, b) => any;
        stat: (b, c) => any;
        stats: () => any;
        statistics: () => any;
        url: () => any;
    }
}