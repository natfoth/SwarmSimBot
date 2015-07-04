var SwarmBot = (function () {
    function SwarmBot(game) {
        this.listOfPurchasableUnints = [];
        this.game = game;
        this.larva = game.units()["larva"];
        this.drone = game.units()["drone"];
        this.queen = game.units()["queen"];
        this.unitsToParse = [this.drone, this.queen];
        this.unitsToParse.reverse();
    }
    SwarmBot.prototype.start = function (interval) {
        this.mainLoop();
        this.timer = setInterval(this.mainLoop, interval);
    };
    SwarmBot.prototype.stop = function () {
        if (this.timer == null)
            throw new Error("Bot was not started");
        clearInterval(this.timer);
    };
    SwarmBot.prototype.mainLoop = function () {
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
    };
    SwarmBot.prototype.buyLarvaUpgrades = function () {
        var index;
        for (index = 0; index < this.larva.upgrades.list.length; ++index) {
            var currentUpgrade = this.larva.upgrades.list[index];
            if (currentUpgrade.isBuyable()) {
                currentUpgrade.buyMax();
                return true;
            }
        }
        return false;
    };
    SwarmBot.prototype.buyUnitUpgrades = function () {
        var index;
        for (index = 0; index < this.unitsToParse.length; ++index) {
            var currentUnit = this.unitsToParse[index];
            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.upgrades.list.length; ++subIndex) {
                var currentUpgrade = currentUnit.upgrades.list[subIndex];
                if (currentUpgrade.isBuyable()) {
                    var shouldBuy = true;
                    var requiredIndex;
                    for (requiredIndex = 0; requiredIndex < currentUpgrade.requires.length; ++requiredIndex) {
                        var currentRequire = currentUpgrade.requires[requiredIndex];
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
    };
    SwarmBot.prototype.setupListOfPurchasableUnits = function () {
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
            }
        }
        return true;
    };
    SwarmBot.prototype.findBestUnitToBuy = function () {
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
    };
    SwarmBot.prototype.buyOneUnit = function (unitToBuy) {
        unitToBuy.buy(1);
        console.log("Purchasing : 1 - " + unitToBuy.name);
    };
    SwarmBot.prototype.countOfUnit = function (unit) {
        var currencyCount = unit.count().c[0];
        if (unit.count().c.length == 3) {
            currencyCount = Number(unit.count().c[0].toString() + unit.count().c[1].toString());
        }
        return currencyCount;
    };
    return SwarmBot;
})();
var bot = new SwarmBot(angular.element(document.getElementsByTagName("body")[0]).scope()["game"]);
bot.start(1000);
//# sourceMappingURL=bot.js.map