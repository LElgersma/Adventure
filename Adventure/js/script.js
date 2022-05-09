// -- Variables to hold JSON data --
var monsterInfo;
var attributeInfo;
// -- End JSON data variabls --

// --- Event listeners ---
$("#monsterName").keypress(function (e) { 
    if(e.keyCode == 13) {
        $("#findMonster").click();
    }
});

$("#monsterAttribute").keypress(function (e) { 
    if(e.keyCode == 13) {
        $("#findMonster").click();
    }
});

$("#radioLevel").keypress(function (e) { 
    if(e.keyCode == 13) {
        $("#findMonster").click();
    }
});

$("#monsterName").click(function() {
    displayMonster();
});
// --- End event listeners ---

// -- Fetch monster array --
fetch("json/monsters.json")
  .then((response) => {
    return response.json();
  })
  .then((monsterInfoData) => {
    monsterInfo = monsterInfoData;
    console.log(monsterInfoData);
    console.log();
  });
// -- End monster fetch --

// -- Fetch attribute array --
fetch("json/attribs.json")
  .then((response) => {
    return response.json();
  })
  .then((monsterAttributes) => {
    attributeInfo = monsterAttributes;
    console.log(monsterAttributes);
    console.log();
  });
// -- End attribute fetch --

function displayMonster() {
    // --- Display monster information 
    let monsterError = true;
    let attributeError = true;
    let missingInfoError = true;
    let monsterNum;
    let attributeNum;

    // --- Loop through each monster to find correct one ---
    for (let i = 0; i < monsterInfo.monsters.length; i++) {
        // - Construct name with radio button -
        let name = document.querySelector("#monsterName").value.toLowerCase();
        let rank;

        if(document.querySelector("#monsterLevelNone").checked) {
            rank = document.querySelector("#monsterLevelNone").value.toLowerCase();
        } else if(document.querySelector("#monsterLevelTranscended").checked) {
            rank = document.querySelector("#monsterLevelTranscended").value.toLowerCase();
        } else if(document.querySelector("#monsterLevelAscended").checked) {
            rank = document.querySelector("#monsterLevelAscended").value.toLowerCase();
        }
        // - End name construction -

        // - Make sure info is entered -
        if(name != "") {
            missingInfoError = false;
            name = rank + name;
            
            // -- Check if monster is in database --
            if (monsterInfo.monsters[i].name.toLowerCase() === name) {
                // Monster found
                monsterError = false;
                monsterNum = i;
                break;
            } else {
                // Monster not found
                //console.log("No monsters");
                monsterError = true;
            }
            // -- End check for monster in database --
        } else {
            missingInfoError = true;
        }
        // - End check for info entered -
    }
    // --- End looping for correct monster ---

    // --- Loop through each attribute to find correct one ---
    for (let i = 0; i < attributeInfo.attributes.length; i++) {
        let attribute = document.querySelector("#monsterAttribute").value.toLowerCase();

        // - Make sure info is entered -
        if(attribute != "") {
            missingInfoError = false;
            // -- Check if attribute is in database --
            if (attributeInfo.attributes[i].attr.toLowerCase() === attribute) {
                // Attribute found
                attributeError = false;
                attributeNum = i;
                break;
            } else {
                // No attribute found
                //console.log("No attributes");
                attributeError = true;
            }
            // -- End check for attribute in database --
        } else {
            missingInfoError = true;
        }
        // - End check for info entered -
    }
    // --- End looping for correct attribute ---

    // - Remove monster information div for reseting page -
    if (document.querySelector("#monsterInfo") != null) {
        document.querySelector("#monsterInfo").remove();
    }
    // - End removal of monster information div -

    // Monster information
    createBlock("monsterInfo");
    // End monster information

    // --- Error occurs ---
    if (monsterError || attributeError || missingInfoError) {
        // -- Missing info --
        if(missingInfoError) {
            warningBlock("missingInfo");
        } else {
            // -- Both monster and attribute error --
            if(monsterError && attributeError) {
                warningBlock("attribute/monster");
            } else {
                // -- Either monster or attribute error --
                if(monsterError) {
                    // Monster Error 
                    warningBlock("monster");
                } else if(attributeError) {
                    // Attribute Error 
                    warningBlock("attribute");
                }
                // -- End either monster or attribtue error --
            }
            // -- End both monster and attribute error --
        }
        // -- End missing info --

    } else if(!monsterError && !attributeError) {
        // --- Fill each section of information ---
        let block;

        // Main block
        block = "main";
        createBlock(block); // Create main block
        // End main block

        // -- Name, health, diplomacy --
        
        // General Block
        block = "generalInfo";
        createBlock(block);
        // End general block 

        fillMonsterInformation("monsterName", "Name: ", block, attributeInfo.attributes[attributeNum].attr 
                                                                + " " + monsterInfo.monsters[monsterNum].name);
        fillMonsterInformation("monsterBaseHealth", "Health: ", block, monsterInfo.monsters[monsterNum].hp);
        fillMonsterInformation("monsterDip", "Diplomacy: ", block, monsterInfo.monsters[monsterNum].dipl);
        // -- End name, health, diplomacy --

        // -- Resistances --

        // Resist Block
        block = "resistInfo";
        createBlock(block);
        // End resist block 
        
        fillMonsterInformation("monsterPhysDef", "Physical Resist: ", block, monsterInfo.monsters[monsterNum].pdef);
        fillMonsterInformation("monsterMagDef", "Magical Resist: ", block, monsterInfo.monsters[monsterNum].mdef);
        // -- End Resistances --

        // -- Effects --

        // Effect Block
        block = "effectInfo";
        createBlock(block);
        // End effect block 
        
        fillMonsterInformation("monsterHealthEff", "Health (De)Buff: ", block, attributeInfo.attributes[attributeNum].health);
        fillMonsterInformation("monsterDipEff", "Diplomacy (De)Buff: ", block, attributeInfo.attributes[attributeNum].dipl);
        // -- End Effects --

        // -- Image --

        // Image Block
        block = "imageInfo";
        createBlock(block);
        // End image block 
        
        fillMonsterInformation("monsterImg", "image", block, monsterInfo.monsters[monsterNum].image);
        // -- End Image --

        // -- Comparison --
        compareMonsterStats(monsterNum, attributeNum);
        // -- End comparison --
        
        // -- Reset and scroll to results --
        //window.scrollTo(document.querySelector("#monsterInfo").offsetTop,0);
        document.querySelector("#monsterAttribute").value = "";
        document.querySelector("#monsterAttribute").focus();
        document.querySelector("#monsterName").value = "";
        // -- End reset and scrolling --

        // --- End filling of each section ---
    }
}

function warningBlock(blockName) {
    let message;

    if(blockName == "missingInfo") {
        message = "Please enter all information";
    } else {
        // -- Add warning message to page when errors occur --
        message = "This " + blockName + " does not exist";
    
        if(blockName == "monster") {
            document.querySelector("#monsterName").focus();
        } else {
            document.querySelector("#monsterAttribute").focus();
        }
    }
    
    // - Create warning block -
    let newMonsterWarn = document.createElement("div");
    newMonsterWarn.setAttribute("id", "warning");
    newMonsterWarn.setAttribute("class", "warning");
    document.querySelector("#monsterInfo").appendChild(newMonsterWarn);
    // - End warning block -

    // - Create warning message -
    let newWarnMessage = document.createElement("p")
    newWarnMessage.setAttribute("id","warnMess");
    newWarnMessage.setAttribute("class","warnMess");
    newWarnMessage.innerHTML = message;
    document.querySelector("#warning").appendChild(newWarnMessage);
    // - End warning message -
}

function createBlock(blockName) {
    // -- Create block for information --
    let newBlockElem = document.createElement("div");
    newBlockElem.setAttribute("id", blockName);
    newBlockElem.setAttribute("class", blockName);
    if(blockName == "main" || blockName == "imageInfo") {
        // Create block for child of monsterInfo div
        document.querySelector("#monsterInfo").appendChild(newBlockElem);
    } else if(blockName == "monsterInfo") {
        // Create block for child of homeBody div
        document.querySelector("#homeBody").appendChild(newBlockElem);
    } else if(blockName == "compareSection") {
        // Create block for child of main div
        document.querySelector("#monsterInfo").insertBefore(newBlockElem, document.querySelector("#monsterInfo").firstChild);
    } else {
        // Create block for child of main div
        document.querySelector("#main").appendChild(newBlockElem);
    }
}

function fillMonsterInformation(infoPart, infoLabel, block, info) {
    // -- Fills specific details for monster in each section --
    if(infoLabel == "image") {
        // - Create image specific element -
        let newImage = document.createElement("img");
        newImage.setAttribute("id", infoPart + "Image");
        newImage.setAttribute("class", infoPart + "Image");
        newImage.setAttribute("src",info)
        document.querySelector("#" + block).appendChild(newImage);
        // - End image specific element -
    } else {
        // - Section element block -
        let newElem = document.createElement("div");
        newElem.setAttribute("id", infoPart + "Section");
        newElem.setAttribute("class", infoPart + "Section");
        document.querySelector("#" + block).appendChild(newElem);
        // - End section element block -

        // - Create label element -
        let newLabel = document.createElement("label");
        newLabel.setAttribute("class", infoPart + "Label");
        newLabel.innerHTML = infoLabel;
        document.querySelector("#" + infoPart + "Section").appendChild(newLabel);
        // - End label element creation -

        // - Create text element -
        let newInfo = document.createElement("div");
        newInfo.setAttribute("id", infoPart + "Text");
        newInfo.setAttribute("class", infoPart + "Text");
        newInfo.innerHTML = info;
        document.querySelector("#" + infoPart + "Section").appendChild(newInfo);
        // - End text element creation -
    }
}

function compareMonsterStats(monsterNumber, attributeNumber) {
    // -- Compare stats to find best outcome --
    // -- Element block --
    createBlock("compareSection");
    // -- End element block --

    // -- Create label --
    let newLabel = document.createElement("label");
    newLabel.setAttribute("class", "compareLabel");
    newLabel.innerHTML = "Stats Comparison: ";
    document.querySelector("#compareSection").appendChild(newLabel);
    // -- End label creation --

    // -- Create element --
    let newInfo = document.createElement("div");
    newInfo.setAttribute("id", "compareText");
    newInfo.setAttribute("class", "compareText");
    newInfo.innerHTML = compareCalculations(monsterNumber, attributeNumber);
    document.querySelector("#compareSection").appendChild(newInfo);
    // -- End element creation --
}

function compareCalculations(monsNum, attrNum) {
    // -- Setup variables --
    var finalHealth = 0;
    var finalDipl = 0;
    var comparisonMessage = "";

    let baseHealth = monsterInfo.monsters[monsNum].hp;
    let baseDipl = monsterInfo.monsters[monsNum].dipl;
    let phyDef = monsterInfo.monsters[monsNum].pdef;
    let magDef = monsterInfo.monsters[monsNum].mdef;

    let healthChng = attributeInfo.attributes[attrNum].health;
    let diplChng = attributeInfo.attributes[attrNum].dipl;
    // -- End variable setup --

    // - Calculations -
    finalHealth = baseHealth * healthChng;
    finalDipl = baseDipl * diplChng;
    console.log(finalHealth + " " + finalDipl);
    // - End calculations -

    // -- Construc Message --
    comparisonMessage += "<b><u>"

    if (finalHealth > finalDipl) {
        comparisonMessage += "Flatter it.";
    } else {
        if(finalHealth < finalDipl) {
            comparisonMessage += "Kill it with ";
            
            if(phyDef < magDef) {
                comparisonMessage += "physical!";
            } else if(phyDef > magDef) {
                comparisonMessage += "magic!";
            } else {
                comparisonMessage += "either physical or magic!";
            }
        } else {
            comparisonMessage += "Either flatter him or kill it with ";

            if(phyDef < magDef) {
                comparisonMessage += "physical!";
            } else if(phyDef > magDef) {
                comparisonMessage += "magic!";
            } else {
                comparisonMessage += "either physical or magic!";
            }
        }
    }

    comparisonMessage += "</u></b><br><p style='font-size: x-large; color: rgb(149, 0, 0);'><i>";
    comparisonMessage += "~" + Math.round(finalHealth) + " health vs ~" + Math.round(finalDipl) + " Diplomacy";
    comparisonMessage += "</i></p>";
    // -- End message construction --

    return comparisonMessage;
}