declare module SwarmSim {
    export interface IAchievement {
        game: IGame;
        type: any;
        name: string;
        requires: any;
        visible: any;
        _init: () => any;
        description: () => string;
        isEarned: () => boolean;
        earn: (a) => any;
        earnedAtMillisElapsed: () => any;
        earnedAtMoment: () => any;
        pointsEarned: () => any;
        isMasked: () => boolean;
        isUnmasked: () => boolean;
        hasProgress: () => boolean;
        progressMax: () => any;
        progressVal: () => any;
        progressPercent: () => any;
        progressOrder: () => any;
    }
}