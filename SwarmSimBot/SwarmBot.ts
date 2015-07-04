class SwarmBot {
    private game: SwarmSim.IGame;
    private larva: SwarmSim.IUnit;
    private drone: SwarmSim.IUnit;
    private queen: SwarmSim.IUnit;
    private unitsToParse: SwarmSim.IUnit[];

    constructor(game: SwarmSim.IGame) {
        this.game = game;
        this.larva = game.units()["larva"];
        this.drone = game.units()["drone"];
        this.queen = game.units()["queen"];

        this.unitsToParse = [this.drone, this.queen];
        this.unitsToParse.reverse();
    }

    private timer: number;
    start(interval: number) {
        this.mainLoop();

        this.timer = setInterval(this.mainLoop, interval);
    }

    stop() {
        if (this.timer == null)
            throw new Error("Bot was not started");
        clearInterval(this.timer);
    }

    private mainLoop() {

        if (this.buyLarvaUpgrades()) {
            return;
        }

        if (this.buyUnitUpgrades()) {
            return;
        }

        this.setupListOfPurchasableUnits();
        var bestunit = this.findBestUnitToBuy();
        if (undefined != bestunit) {
            this.buyOneUnit(bestunit);
            return;
        }
    }

    private buyLarvaUpgrades() {
        var index;
        for (index = 0; index < this.larva.upgrades.list.length; ++index) {
            var currentUpgrade = this.larva.upgrades.list[index];

            if (currentUpgrade.isBuyable())// always buy the max of the larva for territory!
            {
                currentUpgrade.buyMax();
                return true;
            }
        }
        return false;
    }

    private buyUnitUpgrades() {
        var index;
        for (index = 0; index < this.unitsToParse.length; ++index) {
            var currentUnit = this.unitsToParse[index];

            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.upgrades.list.length; ++subIndex) {

                var currentUpgrade = <SwarmSim.IUpgrade>currentUnit.upgrades.list[subIndex];

                if (currentUpgrade.isBuyable()) {
                    var shouldBuy = true;

                    var requiredIndex;
                    for (requiredIndex = 0; requiredIndex < currentUpgrade.requires.length; ++requiredIndex) {
                        var currentRequire = <SwarmSim.IRequirement>currentUpgrade.requires[requiredIndex];

                        var unitCount = currentRequire.unit.count().c[0];
                        var requireCount = currentRequire.val.toNumber();

                        var rquiredCountMultiplied = requireCount * 3.0;

                        if (rquiredCountMultiplied > unitCount) {
                            shouldBuy = false;
                        }
                    }

                    if (shouldBuy) {
                        currentUpgrade.buy(1);
                        console.log("Purchasing Upgrade : " + currentUpgrade.name);
                        return true;
                    }


                    var bob = 1;
                }
            }
        }
    }




    private setupListOfPurchasableUnits() {
        // console.clear();
        var listOfPurchasableUnints = [];

        var index;
        for (index = 0; index < this.unitsToParse.length; ++index) {
            //console.log("----------------");

            var currentUnit = this.unitsToParse[index];

            // console.log("Parsing : " + currentUnit.name);
            // console.log("Is Visible and Buyable : " + currentUnit.isBuyable());

            var canBuy = true;
            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.cost.length; ++subIndex) {

                var currentCost = currentUnit.cost[subIndex];
                //console.log(currentCost.unittype.name + " : " + currentCost.val.toNumber());


                var currency = currentCost.unit;
                var currencyCount = this.countOfUnit(currency);
            
                //console.log("We have : " + currencyCount + " - of " + currency.name);

                if (currencyCount < currentCost.val.toNumber()) {
                    canBuy = false;
                }
            }

            if (currentUnit.isBuyable() == false) {
                canBuy = false;
            }

            if (canBuy) {
                //console.log("We Can Buy this Item");
                listOfPurchasableUnints.push(currentUnit);
            }
            else {
                //console.log("Not Enough Funds");
            }
        }

        return true;
    }

    private listOfPurchasableUnints = [];
    private findBestUnitToBuy(): SwarmSim.IUnit {
        if (this.listOfPurchasableUnints.length == 1) {
            return this.listOfPurchasableUnints[0];
        }
        else {
            var index;
            for (index = 0; index < this.unitsToParse.length; ++index) {
                var canBuy = true;
                var currentUnit = this.unitsToParse[index];

                var subIndex;
                for (subIndex = 0; subIndex < currentUnit.cost.length; ++subIndex) {

                    var currentCost = currentUnit.cost[subIndex];
                    var cost = currentCost.val.toNumber();
                    var costMuliplied = cost * 2;


                    var currencyUnity = currentCost.unit;
                    var currencyUnityCount = this.countOfUnit(currencyUnity);

                    if (costMuliplied > currencyUnityCount) {
                        canBuy = false;
                    }

                }

                if (canBuy) {
                    return currentUnit;
                }
            }
        }
    }

    private buyOneUnit(unitToBuy: SwarmSim.IUnit) {
        unitToBuy.buy(1);
        console.log("Purchasing : 1 - " + unitToBuy.name);
    }

    private countOfUnit(unit: SwarmSim.IUnit) {
        var currencyCount = unit.count().c[0];
        if (unit.count().c.length == 3) {
            currencyCount = Number(unit.count().c[0].toString() + unit.count().c[1].toString());
        }

        return currencyCount;
    }
}