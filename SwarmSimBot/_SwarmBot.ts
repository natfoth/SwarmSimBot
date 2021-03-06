﻿class SwarmBot {
    private game: SwarmSim.IGame;
    private larva: SwarmSim.IUnit;
    private drone: SwarmSim.IUnit;
    private queen: SwarmSim.IUnit;
    private unitsToParse: SwarmSim.IUnit[];
    private militaryUnitsToParse: SwarmSim.IUnit[];
    private listOfPurchasableUnits: SwarmSim.IUnit[];
    private commands;
    private militaryPrct: number;

    constructor(game: SwarmSim.IGame) {
        this.game = game;
        this.larva = game.units()["larva"];
        this.drone = game.units()["drone"];
        this.queen = game.units()["queen"];
        this.commands = angular.element(document.body).injector().get('commands');
        this.unitsToParse = [];
        this.militaryUnitsToParse = [];
        this.listOfPurchasableUnits = [];
        this.militaryPrct = 15;
    }

    private timer: number;
    start(interval: number) {
        this.mainLoop();

        this.timer = setInterval(() => this.mainLoop(), interval);
    }

    stop() {
        if (this.timer == null)
            throw new Error("Bot was not started");
        clearInterval(this.timer);
    }

    private mainLoop() {

        if (this.buyNexusUpgrades())
            return;

        this.buyLarvaUpgrades();
        this.buyMeatUpgrades();

        if (this.nexusUnitLogic())
            return;


        this.buyUnitUpgrades();

        if (this.achivementsLogic())
            return;

        if (this.spellsLogic())
            return;

        this.setupProductionUnitList();
        this.setupMilitaryUnitList();
        this.setupListOfPurchasableUnits();

        this.buyBestMilitaryUnitToBuy();

        


        var totalThatWeCanBuy = this.countOfUnit(this.larva) * 0.5;

        var bestunit = this.findBestUnitToBuy();
        if (undefined != bestunit) {
            var boughtAmount = this.buyUnitPct(bestunit, 100);
            totalThatWeCanBuy = totalThatWeCanBuy - boughtAmount;
        }

        var secondBestunit = this.findBestUnitToBuy(bestunit);
        if (undefined != secondBestunit) {
            if (this.countOfUnit(secondBestunit) < 500000) // dont buy a secondary if it has more then 500k
                this.buyUnitLeftOver(secondBestunit, totalThatWeCanBuy);
        }

        return;

        
    }

    private buyNexusUpgrades()
    {
        var index;
        for (index = 0; index < this.game.units()['nexus'].upgrades.list.length; ++index)
        {
            var currentUpgrade = this.game.units()['nexus'].upgrades.list[index];

            if (currentUpgrade.isBuyable())// always buy the max of the nexus for energy!
            {
                this.buyUpgradeMax(currentUpgrade);
                console.log("Purchased Nexus Upgrade : " + currentUpgrade.name);
                return false;
            }

            if (currentUpgrade.name == "nexus3")
            {
                if (currentUpgrade.isVisible())
                {
                    if (currentUpgrade.cost[0].val.toNumber() < this.countOfUnit(this.game.units()['meat']) && currentUpgrade.cost[1].val.toNumber() < this.countOfUnit(this.game.units()['energy'])) {
                        console.log("Waiting for Nexus Upgrade");
                        return true;
                    }
                }
            }

            if (currentUpgrade.name == "nexus4")
            {
                if (currentUpgrade.isVisible())
                {
                    if (currentUpgrade.cost[0].val.toNumber() < this.countOfUnit(this.game.units()['meat']) && currentUpgrade.cost[1].val.toNumber() < this.countOfUnit(this.game.units()['energy'])) {
                        console.log("Waiting for Nexus Upgrade");
                        return true;
                    }
                }
            }

            if (currentUpgrade.name == "nexus5")
            {
                if (currentUpgrade.isVisible())
                {
                    if (currentUpgrade.cost[0].val.toNumber() < this.countOfUnit(this.game.units()['meat']) && currentUpgrade.cost[1].val.toNumber() < this.countOfUnit(this.game.units()['energy'])) {
                        console.log("Waiting for Nexus Upgrade");
                        return true;
                    }
                }
            }
        }
        return false;

    }

    private buyLarvaUpgrades()
    {
        var index;
        for (index = 0; index < this.larva.upgrades.list.length; ++index) {
            var currentUpgrade = this.larva.upgrades.list[index];

            if (currentUpgrade.isBuyable())// always buy the max of the larva for territory!
            {
                this.buyUpgradeMax(currentUpgrade);
                console.log("Purchased Larva Upgrade : " + currentUpgrade.name);
                return true;
            }
        }
        return false;
    }

    private buyMeatUpgrades()
    {
        var index;
        for (index = 0; index < this.game.units()['meat'].upgrades.list.length; ++index)
        {
            var currentUpgrade = this.game.units()['meat'].upgrades.list[index];

            if (currentUpgrade.isBuyable())// always buy the max of the larva for territory!
            {
                this.buyUpgradeMax(currentUpgrade);
                console.log("Purchased Meat Upgrade : " + currentUpgrade.name);
                return true;
            }
        }
        return false;
    }


    private setupProductionUnitList()
    {
        var nextUnit = this.game.units()['drone'].next;
        while (nextUnit != undefined)
        {
            this.unitsToParse.push(nextUnit);
            nextUnit = nextUnit.next;
        }
        this.unitsToParse.reverse();
    }

    private setupMilitaryUnitList() {
        this.militaryUnitsToParse = [];
        var index;
        for (index = 0; index < this.game.unitlist().length; ++index)
        {
            var currentUnit = this.game.unitlist()[index];

            var isBuyable = currentUnit.isBuyable();
            if (isBuyable)
            {
                var shouldAddUnit = false;
                var subIndex;
                for (subIndex = 0; subIndex < currentUnit.prod.length; ++subIndex)
                {
                    var producedUnit = currentUnit.prod[subIndex].unit;

                    if (producedUnit.name == "territory")
                    {
                        shouldAddUnit = true;
                    }
                }

                if (shouldAddUnit)
                {
                    this.militaryUnitsToParse.push(currentUnit);
                }
            }

        }

        this.militaryUnitsToParse.reverse()
    }

    private setupListOfPurchasableUnits() {
        // console.clear();
        this.listOfPurchasableUnits = [];

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
                this.listOfPurchasableUnits.push(currentUnit);
            }
            else {
                //console.log("Not Enough Funds");
            }
        }

        //this.listOfPurchasableUnits.reverse();

        return true;
    }

    private buyUnitUpgrades()
    {
        var index;
        for (index = 0; index < this.game.unitlist().length; ++index)
        {
            var currentUnit = this.game.unitlist()[index];
            if (currentUnit == undefined)
                continue;

            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.upgrades.list.length; ++subIndex)
            {

                var currentUpgrade = currentUnit.upgrades.list[subIndex];

                if (currentUpgrade.isBuyable())
                {
                    var shouldBuy = true;

                    var requiredIndex;
                    for (requiredIndex = 0; requiredIndex < currentUpgrade.requires.length; ++requiredIndex)
                    {
                        var currentRequire = currentUpgrade.requires[requiredIndex];

                        var unitCount = this.countOfUnit(currentRequire.unit);
                        var requireCount = currentUpgrade.totalCost()[0].val.toNumber();

                        var rquiredCountMultiplied = requireCount * 3.0;

                        if (rquiredCountMultiplied > unitCount)
                        {
                            shouldBuy = false;
                        }
                    }

                    if (shouldBuy)
                    {
                        this.buyUpgrade(currentUpgrade, 1);
                        console.log("Purchasing Upgrade : " + currentUpgrade.name);
                        return true;
                    }
                }
            }
        }
    }


    private findBestUnitToBuy(ignoreUnit?: SwarmSim.IUnit): SwarmSim.IUnit
    {
        var foundUnit = false;
        var index;
        for (index = 0; index < this.listOfPurchasableUnits.length; ++index) {
            var canBuy = true;
            var currentUnit = this.listOfPurchasableUnits[index];

            if (ignoreUnit != undefined && currentUnit.name == ignoreUnit.name) {
                foundUnit = true;
                continue;
            }

            if (ignoreUnit != undefined && !foundUnit) {
                continue;
            }

            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.cost.length; ++subIndex) {

                var currentCost = currentUnit.cost[subIndex];
                var cost = currentCost.val.toNumber();
                var costMuliplied = cost * 4;


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

    private buyBestMilitaryUnitToBuy()
    {

        var larvaCountWeCanUse = this.countOfUnit(this.game.units()['larva']) * (this.militaryPrct * 0.01);

        var bestUnit = undefined;
        var bestUnitProduction = 0;
        var bestAmountToBuy = 0;

        var index;
        for (index = 0; index < this.militaryUnitsToParse.length; ++index) {
            var currentUnit = this.militaryUnitsToParse[index];

            var totalNumberWeCanBuy = this.maxThatCanBeBought(currentUnit);
            if (totalNumberWeCanBuy > larvaCountWeCanUse) {
                totalNumberWeCanBuy = larvaCountWeCanUse;
            }

            var multiAmount = totalNumberWeCanBuy * currentUnit.twinMult().toNumber();


            var howManyTerrUnitProduces = currentUnit.prod[0].val.toNumber();

            var totalForAll = multiAmount * howManyTerrUnitProduces;

            if (totalForAll > bestUnitProduction) {
                bestUnitProduction = totalForAll;
                bestUnit = currentUnit;
                bestAmountToBuy = totalNumberWeCanBuy;
            }
        }

        if (bestUnit != undefined && bestAmountToBuy > 0) {
            var amount = parseInt(bestAmountToBuy.toString());

            this.buyUnit(bestUnit, amount);
            //bestUnit.buy(amount);
            // console.log("Purchasing : " + amount + " - " + bestUnit.name);
        }

    }

    private buyUpgrade(upgradeToBuy: SwarmSim.IUpgrade, numToBuy: number)
    {
        this.commands.buyUpgrade({ upgrade: upgradeToBuy, num: numToBuy });
        console.log("Buying Upgrade : " + numToBuy + " - " + upgradeToBuy.name);
    }

    private buyUpgradeMax(upgradeToBuy: SwarmSim.IUpgrade)
    {
        this.commands.buyMaxUpgrade({ upgrade: upgradeToBuy, num: 1 }); // 1 = 100%
        console.log("Buying Upgrade : Max - " + upgradeToBuy.name);
    }

    private buyUnit(unitToBuy: SwarmSim.IUnit, numToBuy: number) {
        var maxCount = this.maxThatCanBeBought(unitToBuy);
        if (maxCount < numToBuy)
            numToBuy = maxCount;

        this.commands.buyUnit({ unit: unitToBuy, num: numToBuy });
        console.log("Purchasing : " + numToBuy + " - " + unitToBuy.name + " " + unitToBuy.suffix);
    }

    private buyOneUnit(unitToBuy: SwarmSim.IUnit)
    {
        this.buyUnit(unitToBuy, 1);
    }

    private buyUnitPct(unitToBuy: SwarmSim.IUnit, pctToBuy: number) {
        var count = this.maxThatCanBeBought(unitToBuy);

        if (count < 5) {
            this.buyUnit(unitToBuy, 1);
            return 1;
        }
        else {
            if (pctToBuy == 100) {
                var countPct = count;
            }
            else {
                var pctToFloat = pctToBuy * 0.01;
                var countPct = count * pctToFloat;
                countPct = parseInt(countPct.toString());
            }

            this.buyUnit(unitToBuy, countPct);

            return countPct;
        }


    }

    private buyUnitLeftOver(unitToBuy: SwarmSim.IUnit, leftOverAmount: number) {
        var count = this.maxThatCanBeBought(unitToBuy);

        if (leftOverAmount < count)
            count = leftOverAmount;

        count = parseInt(count.toString());

        this.buyUnit(unitToBuy, count);

        return count;
    }

    private maxThatCanBeBought(unit: SwarmSim.IUnit) {
        var lowestAmount = 999999999999;
        var subIndex;
        for (subIndex = 0; subIndex < unit.cost.length; ++subIndex) {

            var currentCost = unit.cost[subIndex];
            var costAmount = currentCost.val.toNumber();

            var currencyUnity = currentCost.unit;
            var currencyUnityCount = this.countOfUnit(currencyUnity);

            var amountWeCanHave = currencyUnityCount / costAmount;


            if (amountWeCanHave < lowestAmount) {
                lowestAmount = amountWeCanHave;
            }
        }

        // lowestAmount = lowestAmount * unit.twinMult().toNumber();

        return parseInt(lowestAmount.toString());
    }

    private countOfUnit(unit: SwarmSim.IUnit)
    {
        return this.game.units()[unit.name].count().toNumber()
        //return this.game.session.state.unittypes[unit.name].toNumber();
    }

    private achivementsLogic() {
        if (this.droneAchivementLogic())
            return true;

        return false;
    }

    private droneAchivementLogic() {
        if (this.countOfUnit(this.game.units()['greaterqueen']) > 0) {
            var drone3Achivement = this.game.achievements()['drone3'];
            if (drone3Achivement.pointsEarned() == 0) {
                this.buyUnit(this.game.units()['drone'], 10000);
                return true;
            }

            var swarmling2Achivement = this.game.achievements()['swarmling2'];
            if (swarmling2Achivement.pointsEarned() == 0) {
                this.buyUnit(this.game.units()['swarmling'], 1000000);
                return true;
            }
        }

        if (this.countOfUnit(this.game.units()['greaterqueen']) > 300) {
            var dontStopMeNowAchivement = this.game.achievements()['queen3'];
            if (dontStopMeNowAchivement.pointsEarned() == 0) {
                this.buyUnit(this.game.units()['queen'], 1000000);
                return true;
            }
        }

        return false;
    }

    
    private spellsLogic() {
        var reqEnergy = 4000;

        if (this.game.units()['nexus'].count().toNumber() < 3 || this.game.units()['nexus'].count().toNumber() >= 5)
        {
            var energy = this.game.units()['energy'];
            if (this.countOfUnit(energy) > reqEnergy) {
                var swarmWarp = energy.upgrades.byName.swarmwarp;
                if (swarmWarp.isBuyable()) {
                     this.buyUpgrade(swarmWarp, 1);
                    return true;
                }

                var asdfasdf = 1;
            }
        }


        return false;
    }

    private nexusUnitLogic() {
        if (this.nightBugLogic())
            return true;

        if (this.nexusMothLogic())
            return true;

        if (this.nexusBatLogic())
            return true;

        return false;
    }



    private nightBugLogic() {
        var nexus = this.game.units()['nexus'];
        var nightbugs = this.game.units()['nightbug'];
        var energy = this.game.units()['energy'];

        if (nexus.count().toNumber() >= 3 && nightbugs.count().toNumber() < 300) {
            var max = this.maxThatCanBeBought(nightbugs);
            var maxToBuy = 300 - nightbugs.count().toNumber();
            if (max > maxToBuy)
                max = maxToBuy;

            if (max > 0) {
                this.buyUnit(nightbugs, max);
                return false;
            }
        }
        return false;
    }

    private nexusMothLogic() {
        var nexus = this.game.units()['nexus'];
        var moth = this.game.units()['moth'];
        var energy = this.game.units()['energy'];

        if (nexus.count().toNumber() >= 4 && moth.count().toNumber() < 1500) {
            var max = this.maxThatCanBeBought(moth);
            var maxToBuy = 1500 - moth.count().toNumber();
            if (max > maxToBuy)
                max = maxToBuy;

            if (max > 0) {
                this.buyUnit(moth, max);
                return false;
            }
        }
        return false;
    }

    private nexusBatLogic() {
        var nexus = this.game.units()['nexus'];
        var bat = this.game.units()['bat'];
        var energy = this.game.units()['energy'];

        if (nexus.count().toNumber() >= 5 && bat.count().toNumber() < 600) {
            var max = this.maxThatCanBeBought(bat);
            var maxToBuy = 600 - bat.count().toNumber();
            if (max > maxToBuy)
                max = maxToBuy;

            if (max > 0) {
                this.buyUnit(bat, max);
                return false;
            }
        }
        return false;
    }
}