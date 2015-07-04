var scope = angular.element(document.getElementsByTagName("body")[0]).scope();
var larva = scope.game.units().larva;
var gqueen = scope.game.units().greaterqueen;
var drone = scope.game.units().drone;


function mainLoop()
{
    
    if(buyLarvaUpgrades())
    {
        return;
    }

    if(buyUnitUpgrades())
    {
        return;
    }

    setupListOfPurchasableUnits();
    var bestunit = findBestUnitToBuy();
    if (undefined != bestunit)
    {
        buyOneUnit(bestunit);
        return;
    }
}

function buyLarvaUpgrades()
{
    var index;
    for (index = 0; index < larva.upgrades.list.length; ++index) 
    {
        var currentUpgrade = larva.upgrades.list[index];

        if(currentUpgrade.isBuyable())// always buy the max of the larva for territory!
        {
            currentUpgrade.buyMax();
            return true;
        }
    }
    return false;
}

var unitsToParse = [scope.game.units().drone, scope.game.units().queen];
unitsToParse.reverse();

function buyUnitUpgrades()
{
    var index;
    for (index = 0; index < unitsToParse.length; ++index) 
    {
        var currentUnit = unitsToParse[index];

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

                    var unitCount = currentRequire.unit.count().c[0];
                    var requireCount = currentRequire.val.toNumber();

                    var rquiredCountMultiplied = requireCount * 3.0;

                    if(rquiredCountMultiplied > unitCount)
                    {
                        shouldBuy = false;
                    }
                }

                if(shouldBuy)
                {
                    currentUpgrade.buy(1);
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
    listOfPurchasableUnints = [];

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
            listOfPurchasableUnints.push(currentUnit);
        }
        else
        {
            //console.log("Not Enough Funds");
        }
    }

    return true;
}

var listOfPurchasableUnints = [];
function findBestUnitToBuy()
{
    if(listOfPurchasableUnints.length == 1)
    {
        return listOfPurchasableUnints[0];
    }
    else
    {
        var index;
        for (index = 0; index < unitsToParse.length; ++index) 
        {
            var canBuy = true;
            var currentUnit = unitsToParse[index];

            var subIndex;
            for (subIndex = 0; subIndex < currentUnit.cost.length; ++subIndex) 
            {

                var currentCost = currentUnit.cost[subIndex];
                var cost = currentCost.val.toNumber();
                var costMuliplied = cost * 2;


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

function buyOneUnit(unitToBuy)
{
    unitToBuy.buy(1);
    console.log("Purchasing : 1 - " + unitToBuy.name);
}

function countOfUnit(unit)
{
    var currencyCount = unit.count().c[0];
    if(unit.count().c.length == 3)
    {
        currencyCount = Number(unit.count().c[0].toString() + unit.count().c[1].toString());
    }

    return currencyCount
}

mainLoop();

var timer = setInterval(mainLoop,1000);

function stopTimer()
{
    clearInterval(timer);
}