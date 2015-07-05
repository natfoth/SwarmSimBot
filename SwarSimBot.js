var scope = angular.element(document.getElementsByTagName("body")[0]).scope();
var larva = scope.game.units().larva;
var drone = scope.game.units().drone;
var achievement = angular.element(document.body).injector().get('Achievement');
var commands = angular.element(document.body).injector().get('commands');


var militaryPrct = 15;

function mainLoop()
{
    if(buyNexusUpgrades())
        return;

    buyLarvaUpgrades();
    buyMeatUpgrades();

    if(nexusUnitLogic())
        return;


    buyUnitUpgrades();

    if(achivementsLogic())
        return;

    if(spellsLogic())
        return;

    setupProductionUnitList();
    setupMilitaryUnitList();

    buyBestMilitaryUnitToBuy();



    setupListOfPurchasableUnits();

    var totalThatWeCanBuy = countOfUnit(larva) * 0.5;

    var bestunit = findBestUnitToBuy();
    if (undefined != bestunit)
    {
        var boughtAmount = buyUnitPct(bestunit, 100);
        totalThatWeCanBuy = totalThatWeCanBuy - boughtAmount;
    }

    var secondBestunit = findBestUnitToBuy(bestunit);
    if (undefined != secondBestunit)
    {
        if(countOfUnit(secondBestunit) < 500000) // dont buy a secondary if it has more then 500k
            buyUnitLeftOver(secondBestunit, totalThatWeCanBuy);
    }

    return;
}

function buyNexusUpgrades()
{
    var index;
    for (index = 0; index < scope.game.units().nexus.upgrades.list.length; ++index) 
    {
        var currentUpgrade = scope.game.units().nexus.upgrades.list[index];

        if(currentUpgrade.isBuyable())// always buy the max of the nexus for energy!
        {
            buyUpgradeMax(currentUpgrade);
            console.log("Purchased Nexus Upgrade : " + currentUpgrade.name);
            return false;
        }

        if(currentUpgrade.name == "nexus3")
        {
            if(currentUpgrade.isVisible())
            {
                if(currentUpgrade.cost[0].val.toNumber() < countOfUnit(scope.game.units().meat) && currentUpgrade.cost[1].val.toNumber() < countOfUnit(scope.game.units().energy))
                {
                    console.log("Waiting for Nexus Upgrade");
                    return true;
                }
            }
        }

        if(currentUpgrade.name == "nexus4")
        {
            if(currentUpgrade.isVisible())
            {
                if(currentUpgrade.cost[0].val.toNumber() < countOfUnit(scope.game.units().meat) && currentUpgrade.cost[1].val.toNumber() < countOfUnit(scope.game.units().energy))
                {
                    console.log("Waiting for Nexus Upgrade");
                    return true;
                }
            }
        }

        if(currentUpgrade.name == "nexus5")
        {
            if(currentUpgrade.isVisible())
            {
                if(currentUpgrade.cost[0].val.toNumber() < countOfUnit(scope.game.units().meat) && currentUpgrade.cost[1].val.toNumber() < countOfUnit(scope.game.units().energy))
                {
                    console.log("Waiting for Nexus Upgrade");
                    return true;
                }
            }
        }
    }
    return false;
}

function buyLarvaUpgrades()
{
    var index;
    for (index = 0; index < larva.upgrades.list.length; ++index) 
    {
        var currentUpgrade = larva.upgrades.list[index];

        if(currentUpgrade.isBuyable())// always buy the max of the larva for territory!
        {
            buyUpgradeMax(currentUpgrade);
            console.log("Purchased Larva Upgrade : " + currentUpgrade.name);
            return true;
        }
    }
    return false;
}

function buyMeatUpgrades()
{
    var index;
    for (index = 0; index < scope.game.units().meat.upgrades.list.length; ++index) 
    {
        var currentUpgrade = scope.game.units().meat.upgrades.list[index];

        if(currentUpgrade.isBuyable())// always buy the max of the larva for territory!
        {
            buyUpgradeMax(currentUpgrade);
            console.log("Purchased Meat Upgrade : " + currentUpgrade.name);
            return true;
        }
    }
    return false;
}

var unitsToParse = [scope.game.units().drone];

function setupProductionUnitList()
{
    var nextUnit = scope.game.units().drone.next;
    while(nextUnit != undefined)
    {
        unitsToParse.push(nextUnit);
        nextUnit = nextUnit.next;
    }
    unitsToParse.reverse();
    var asdfasdf = 1;
}

var militaryUnitsToParse = [];

function setupMilitaryUnitList()
{
    var index;
    for (index = 0; index < scope.game.unitlist().length; ++index) 
    {
        var currentUnit = scope.game.unitlist()[index];

        var isBuyable = currentUnit.isBuyable();
        if(isBuyable)
        {
            var shouldAddUnit = false;
            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.prod.length; ++subIndex) 
            {
                var producedUnit = currentUnit.prod[subIndex].unit;

                if(producedUnit.name == "territory")
                {
                    shouldAddUnit = true;
                }
            }

            if(shouldAddUnit)
            {
                militaryUnitsToParse.push(currentUnit);
            }
        }
        
    }

    militaryUnitsToParse.reverse()
}

function buyUnitUpgrades()
{
    var index;
    for (index = 0; index < scope.game.unitlist().length; ++index) 
    {
        var currentUnit = scope.game.unitlist()[index];
        if(currentUnit == undefined)
            continue;
    
        var subIndex;
        for (subIndex = 0; subIndex < currentUnit.upgrades.list.length; ++subIndex) 
        {
            
            var currentUpgrade = currentUnit.upgrades.list[subIndex];

            if(currentUpgrade.isBuyable())
            {
                var shouldBuy = true;
                    
                var requiredIndex;
                for (requiredIndex = 0; requiredIndex < currentUpgrade.requires.length; ++requiredIndex) 
                {
                    var currentRequire = currentUpgrade.requires[requiredIndex];

                    var unitCount = countOfUnit(currentRequire.unit);
                    var requireCount = currentUpgrade.totalCost()[0].val.toNumber();

                    var rquiredCountMultiplied = requireCount * 3.0;

                    if(rquiredCountMultiplied > unitCount)
                    {
                        shouldBuy = false;
                    }
                }

                if(shouldBuy)
                {
                    buyUpgrade(currentUpgrade, 1);
                    console.log("Purchasing Upgrade : " + currentUpgrade.name);
                    return true;
                }
                

                var bob = 1;
            }
        }
    }
}




function setupListOfPurchasableUnits()
{
   // console.clear();
    listOfPurchasableUnits = [];

    var index;
    for (index = 0; index < unitsToParse.length; ++index) 
    {
        //console.log("----------------");

        var currentUnit = unitsToParse[index];

       // console.log("Parsing : " + currentUnit.name);
       // console.log("Is Visible and Buyable : " + currentUnit.isBuyable());

        var canBuy = true;
        var subIndex;
        for (subIndex = 0; subIndex < currentUnit.cost.length; ++subIndex) 
        {

            var currentCost = currentUnit.cost[subIndex];
            //console.log(currentCost.unittype.name + " : " + currentCost.val.toNumber());


            var currency = currentCost.unit;
            var currencyCount = countOfUnit(currency);

            //console.log("We have : " + currencyCount + " - of " + currency.name);

            if(currencyCount < currentCost.val.toNumber())
            {
                canBuy = false;
            }
        }

        if(currentUnit.isBuyable() == false)
        {
            canBuy = false;
        }

        if(canBuy)
        {
            //console.log("We Can Buy this Item");
            listOfPurchasableUnits.push(currentUnit);
        }
        else
        {
            //console.log("Not Enough Funds");
        }
    }

    return true;
}

var listOfPurchasableUnits = [];

function findBestUnitToBuy(ignoreUnit)
{
    if(listOfPurchasableUnits.length == 1)
    {
        return listOfPurchasableUnits[0];
    }
    else
    {
        var foundUnit = false;
        var index;
        for (index = 0; index < listOfPurchasableUnits.length; ++index) 
        {
            var canBuy = true;
            var currentUnit = listOfPurchasableUnits[index];

            if(ignoreUnit != undefined && currentUnit.name == ignoreUnit.name)
            {
                foundUnit = true;
                continue;
            }

            if(ignoreUnit != undefined && !foundUnit)
            {
                continue;
            }

            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.cost.length; ++subIndex) 
            {

                var currentCost = currentUnit.cost[subIndex];
                var cost = currentCost.val.toNumber();
                var costMuliplied = cost * 4;


                var currencyUnity = currentCost.unit;
                var currencyUnityCount = countOfUnit(currencyUnity);

                if(costMuliplied > currencyUnityCount)
                {
                    canBuy = false;
                }              
               
            }

            if(canBuy)
            {
                return currentUnit;
            }
        }
    }
}

function buyBestMilitaryUnitToBuy()
{
    if(militaryUnitsToParse.length == 1)
    {
        return militaryUnitsToParse[0];
    }
    else
    {
        var larvaCountWeCanUse = countOfUnit(scope.game.units().larva) * (militaryPrct * 0.01);

        var bestUnit = undefined;
        var bestUnitProduction = 0;
        var bestAmountToBuy = 0;

        var index;
        for (index = 0; index < militaryUnitsToParse.length; ++index) 
        {
            var currentUnit = militaryUnitsToParse[index];
            
            var totalNumberWeCanBuy = maxThatCanBeBought(currentUnit);
            if(totalNumberWeCanBuy > larvaCountWeCanUse)
            {
                totalNumberWeCanBuy = larvaCountWeCanUse;
            }

            var multiAmount = totalNumberWeCanBuy * currentUnit.twinMult().toNumber();


            var howManyTerrUnitProduces = currentUnit.prod[0].val.toNumber();

            var totalForAll = multiAmount * howManyTerrUnitProduces;

            if(totalForAll > bestUnitProduction)
            {
                bestUnitProduction = totalForAll;
                bestUnit = currentUnit;
                bestAmountToBuy = totalNumberWeCanBuy;
            }            
        }

        if(bestUnit != undefined && bestAmountToBuy > 0)
        {
            var amount = parseInt(bestAmountToBuy);

            buyUnit(bestUnit, amount);
            //bestUnit.buy(amount);
           // console.log("Purchasing : " + amount + " - " + bestUnit.name);
        }
    }
}

function buyUpgrade(upgradeToBuy, numToBuy)
{
    commands.buyUpgrade({upgrade:upgradeToBuy, num:numToBuy});
    console.log("Buying Upgrade : " + numToBuy + " - " + upgradeToBuy.name);
}

function buyUpgradeMax(upgradeToBuy)
{
    commands.buyMaxUpgrade({upgrade:upgradeToBuy, num:1}); // 1 = 100%
    console.log("Buying Upgrade : Max - " + upgradeToBuy.name);
}

function buyUnit(unitToBuy, numToBuy)
{
    var maxCount = maxThatCanBeBought(unitToBuy);
    if(maxCount < numToBuy)
        numToBuy = maxCount;

    commands.buyUnit({unit:unitToBuy, num:numToBuy});
    console.log("Purchasing : " + numToBuy + " - " + unitToBuy.name);
}

function buyOneUnit(unitToBuy)
{
    buyUnit(unitToBuy, 1);
}

function buyUnitPct(unitToBuy, pctToBuy)
{
    var count = maxThatCanBeBought(unitToBuy);

    if(count < 5)
    {
        buyUnit(unitToBuy, 1);
        return 1;
    }
    else
    {
        if(pctToBuy == 100)
        {
            var countPct = count;
        }
        else
        {
            var pctToFloat = pctToBuy * 0.01;
            var countPct = count * pctToFloat;
            countPct = parseInt(countPct);
        }

        buyUnit(unitToBuy, countPct);

        return countPct;
    }


}

function buyUnitLeftOver(unitToBuy, leftOverAmount)
{
    var count = maxThatCanBeBought(unitToBuy);

    if(leftOverAmount < count)
        count = leftOverAmount;

    count = parseInt(count);

    buyUnit(unitToBuy, count);

    return count;
}

function maxThatCanBeBought(unit)
{
    var lowestAmount = 999999999999;
    var subIndex;
    for (subIndex = 0; subIndex < unit.cost.length; ++subIndex) 
    {

        var currentCost = unit.cost[subIndex];
        var costAmount = currentCost.val.toNumber();

        var currencyUnity = currentCost.unit;
        var currencyUnityCount = countOfUnit(currencyUnity);

        var amountWeCanHave = currencyUnityCount / costAmount;


        if(amountWeCanHave < lowestAmount)
        {
            lowestAmount = amountWeCanHave;
        }
     }

    // lowestAmount = lowestAmount * unit.twinMult().toNumber();

     return parseInt(lowestAmount);
}

function countOfUnit(unit)
{
    return scope.game.session.state.unittypes[unit.name].toNumber();
}

function achivementsLogic()
{
    if(droneAchivementLogic())
        return true;

    return false;
}

function droneAchivementLogic()
{
    if(countOfUnit(scope.game.units().greaterqueen) > 0)
    {
        var drone3Achivement = scope.game.achievements().drone3;
        if(drone3Achivement.pointsEarned() == 0)
        {
            buyUnit(scope.game.units().drone, 10000);
            return true;
        }

        var swarmling2Achivement = scope.game.achievements().swarmling2;
        if(swarmling2Achivement.pointsEarned() == 0)
        {
            buyUnit(scope.game.units().swarmling, 1000000);
            return true;
        }
    }

    if(countOfUnit(scope.game.units().greaterqueen) > 300)
    {
        var dontStopMeNowAchivement = scope.game.achievements().queen3;
        if(dontStopMeNowAchivement.pointsEarned() == 0)
        {
            buyUnit(scope.game.units().queen, 1000000);
            return true;
        }
    }

    return false;
}

function spellsLogic()
{
    var reqEnergy = 40000;
    
    if(scope.game.units().nexus.count().toNumber() < 3)
    {
        var energy = scope.game.units().energy;
        if(countOfUnit(energy) > reqEnergy)
        {
            var swarmWarp = energy.upgrades.byName.swarmwarp;
            if(swarmWarp.isBuyable())
            {
               // buyUpgrade(swarmWarp, 1);
                return true;
            }

            var asdfasdf = 1;
        }
    }
    

    return false;
}

function nexusUnitLogic()
{
    if(nightBugLogic())
        return true;

    if(nexusMothLogic())
        return true;

    if(nexusBatLogic())
        return true;

    return false;
}



function nightBugLogic()
{
    var nexus = scope.game.units().nexus;
    var nightbugs = scope.game.units().nightbug;
    var energy = scope.game.units().energy;

    if(nexus.count().toNumber() >= 3 && nightbugs.count().toNumber() < 300)
    {
        var max = maxThatCanBeBought(nightbugs);
        var maxToBuy = 300 - nightbugs.count().toNumber();
        if(max > maxToBuy)
            max = maxToBuy;

        if(max > 0)
        {
            buyUnit(nightbugs, max);
            return false;
        }
    }
    return false;
}

function nexusMothLogic()
{
    var nexus = scope.game.units().nexus;
    var moth = scope.game.units().moth;
    var energy = scope.game.units().energy;

    if(nexus.count().toNumber() >= 4 && moth.count().toNumber() < 1500)
    {
        var max = maxThatCanBeBought(moth);
        var maxToBuy = 1500 - moth.count().toNumber();
        if(max > maxToBuy)
            max = maxToBuy;

        if(max > 0)
        {
            buyUnit(moth, max);
            return false;
        }
    }
    return false;
}

function nexusBatLogic()
{
    var nexus = scope.game.units().nexus;
    var bat = scope.game.units().bat;
    var energy = scope.game.units().energy;

    if(nexus.count().toNumber() >= 5 && bat.count().toNumber() < 600)
    {
        var max = maxThatCanBeBought(bat);
        var maxToBuy = 600 - bat.count().toNumber();
        if(max > maxToBuy)
            max = maxToBuy;

        if(max > 0)
        {
            buyUnit(bat, max);
            return false;
        }
    }
    return false;
}



mainLoop();

var timer = setInterval(mainLoop,15000);

function stopTimer()
{
    clearInterval(timer);
}