config = JSON.parse(FileLib.read("HouseSearch", "config.json"));
recentHouses = config["recentHouses"];
devmode = config["devmode"];
if (recentHouses == undefined) {
    recentHouses = [];
}

function writeConfig(variable, value) {
    config[variable] = value;
    FileLib.write("HouseSearch", "config.json", JSON.stringify(config));
};

timeoutCheck = false;
timeoutLength = 0;

register("tick", () => {
    if (timeoutCheck == true) {
        if (timeoutLength > 60) {
            ChatLib.chat("Searching for houses timed out. Try again");
            timeoutCheck = false;
            timeoutLength = 0;
        } else {
            timeoutLength++;
        }
    } else {
        timeoutLength = 0;
    }
});

register("command", (...arg) => { ///hs help
    if (arg == undefined || arg == "help" || arg.join(" ").removeFormatting() == "") { //check if the search arguments are empty or help
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
        ChatLib.chat("/hs <search> <page> &7- &fdon't put page for just page 1");
        ChatLib.chat("/hs devmode &7- &fenables developer mode");
        ChatLib.chat("/hs recent <page> &7- &fshows recently visited houses");
        ChatLib.chat("/hs resetresenthouses &7- &fresets houses in /hs recent");
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
    } else if (arg == "devmode") { ///hs devmode
        devmode = !devmode;
        writeConfig("devmode", devmode);
        ChatLib.chat("Toggled showing housing.menu ID/Housing ID");
    } else if (arg[0] == "recent") { ///hs recent <page>
        if (recentHouses.length == 0) {
            ChatLib.chat("No recently visited houses!");
            return;
        }
        new Thread(() => { //make new thread so game doesnt lag 
            pageNum = Number(arg[1]);
            ChatLib.chat("Searching for recently visited houses...");
            if (isNaN(pageNum) || arg.length == 1 || pageNum % 1 != 0) {
                totalPages = Math.ceil(recentHouses.length / 5);
                houses = recentHouses.slice(0, 5)
                pageNum = 1;
            } else {
                totalPages = Math.ceil(recentHouses.length / 5);
                if (pageNum > totalPages) {
                    pageNum = totalPages;
                }
                houses = recentHouses.slice(((pageNum - 1) * 5), ((pageNum - 1) * 5) + 5);
            }
            timeoutCheck = true;
            let lines = [ChatLib.getChatBreak("&e&m ")];
            lines.push(ChatLib.getCenteredText(`Results - Page ${pageNum}/${totalPages}`));
            let iterations = 0;
            let didntfind = [];
            houses.forEach((element) => {
                let house = JSON.parse(FileLib.getUrlContent(`https://housing.menu/house-info?id=${element["id"]}`))["houseInfo"][0];
                timeoutCheck = false;
                if (house == undefined) {
                    didntfind.push(`Didn't find House ${element["name"]}! House might be not public!`);
                    lines.push(`${element["name"]} &rnot found`);
                    lines.push("&8&lClick here to join!");
                    lines.push("");
                } else {
                    if (house["alive"]) { //make indicator text for if the house is active (has server or not)
                        indicator = "&a●&r";
                    } else {
                        indicator = "&c●&r";
                    }
                    houseinfomsg = new TextComponent(`${house["name"]}${ChatLib.removeFormatting(element["name"]) == ChatLib.removeFormatting(house["name"]) ? "" : " &f(" + element["name"] + "&f)"}&r, by ${house["creator"]} ${indicator} `).setHover("show_text", `${house["name"]}\n&7Owner: ${house["creator"]}\n\n&7Cookies: &6${house["cookies"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n\n&7Players: &b${house["players"]}\n\n&7Last Updated: &a${house["last_updated"].replace("T", "-").replace(".000Z", " UTC")}${devmode ? "\n&8" : ""}${devmode ? house["id"] : ""}`);
                    lines.push(houseinfomsg);
                    joinmsg = new TextComponent("&e&lClick here to join!").setClick("run_command", `/visit ${house["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${house["name_raw"]}`).setHover("show_text", `Click here to run /visit ${house["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${house["name_raw"]}`);
                    lines.push(joinmsg);
                    lines.push("");
                }
                iterations++;
                if (iterations === houses.length) {
                    didntfind.forEach((line) => {
                        ChatLib.chat(line);
                    });
                    lines.forEach((line) => {
                        ChatLib.chat(line);
                    });
                }
            });
            ChatLib.chat("&7Hover over House names for more info");
            ChatLib.chat(ChatLib.getChatBreak("&e&m "));
        }).start()
        thread = undefined;
    } else if (arg == "resetresenthouses") { ///hs resetresenthouses
        recentHouses = [];
        writeConfig("recentHouses", recentHouses);
        ChatLib.chat("Recent houses reset!");
    } else { ///hs <search> <page>
        thread = new Thread(() => { //make new thread so game doesnt lag 
            pageNum = Number(arg[arg.length - 1]);
            timeoutCheck = true;
            if (isNaN(pageNum) || arg.length == 1 || pageNum % 1 != 0) {
                ChatLib.chat(`Searching for \"${arg.join(" ").removeFormatting()}\"...`);
                houses = JSON.parse(FileLib.getUrlContent(`https://housing.menu/houses?search=${encodeURIComponent(arg.join(" ").removeFormatting())}&amount=250&orderby=last_updated`))["rows"]
                totalPages = Math.ceil(houses.length / 5);
                houses = houses.slice(0, 5);
                pageNum = 1;
            } else {
                ChatLib.chat(`Searching for \"${arg.slice(0, arg.length - 1).join(" ").removeFormatting()}\"...`);
                houses = JSON.parse(FileLib.getUrlContent(`https://housing.menu/houses?search=${encodeURIComponent(arg.slice(0, arg.length - 1).join(" ").removeFormatting())}&amount=250&orderby=last_updated`))["rows"];
                totalPages = Math.ceil(houses.length / 5);
                if (pageNum > totalPages) {
                    pageNum = totalPages;
                }
                houses = houses.slice(((pageNum - 1) * 5), ((pageNum - 1) * 5) + 5);
            }
            timeoutCheck = false;
            if (houses.length == 0) {
                ChatLib.chat("No houses found");
            } else {

                let lines = [ChatLib.getChatBreak("&e&m ")];
                lines.push(ChatLib.getCenteredText(`Results - Page ${pageNum}/${totalPages}`));
                houses.forEach((element) => {
                    if (element["alive"]) { //make indicator text for if the house is active (has server or not)
                        indicator = "&a●&r";
                    } else {
                        indicator = "&c●&r";
                    }
                    houseinfomsg = new TextComponent(`${element["name"]}&r, by ${element["creator"]} ${indicator}`).setHover("show_text", `${element["name"]}\n&7Owner: ${element["creator"]}\n\n&7Cookies: &6${element["cookies"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n\n&7Players: &b${element["players"]}\n\n&7Last Updated: &a${element["last_updated"].replace("T", "-").replace(".000Z", " UTC")}${devmode ? "\n&8" : ""}${devmode ? element["id"] : ""}`)
                    lines.push(houseinfomsg);
                    /* example
                    Blue House, by Penpenpenpenpen
                    (when hovered)
                    Blue House
                    Owner: [MVP+] Penpenpenpenpen

                    Cookies: 10,000

                    Players: 10 

                    Last Updated: 2023-12-03-23:43:01 UTC
                    (if devmode)
                    fb4fec3a-273b-4360-a8e0-4423c5055166
                    */

                    joinmsg = new TextComponent("&e&lClick here to join!").setClick("run_command", `/visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name_raw"]}`).setHover("show_text", `Click here to run /visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name_raw"]}`)
                    lines.push(joinmsg);
                    /* example
                    Click here to join!
                    (when hovered)
                    Click here to run /visit Penpenpenpenpen Blue House
                    */

                    lines.push("");
                });
                lines.forEach((line) => {
                    ChatLib.chat(line);
                });
                ChatLib.chat("&7Hover over House names for more info");
                ChatLib.chat(ChatLib.getChatBreak("&e&m "));
            }
            thread = undefined;
        }).start()
    }
}).setCommandName("hs").setAliases("housesearch", "hsearch").setTabCompletions("help", "devmode", "recent", "resetresenthouses");

let onWorldLoad = false;

register("worldLoad", () => {
    expectWtfmap = false;
    onWorldLoad = true;
});

register("tick", () => {
    if (TabList.getFooter().removeFormatting().includes("You are in ") && onWorldLoad) { // check if player is in housing
        onWorldLoad = false;
        ChatLib.command("wtfmap");
        expectWtfmap = true;
    }
});

register("chat", (msg, event) => {
    if (expectWtfmap && msg.includes("You are currently playing on ")) {
        expectWtfmap = false;
        houseId = msg.slice(37, 73);
        houseName = msg.slice(75, msg.length - 1);
        recentHouses = recentHouses.filter((house) => house["id"] != houseId);
        recentHouses.splice(0, 0, {
            "id": houseId,
            "name": houseName
        })
        writeConfig("recentHouses", recentHouses);
        if (!devmode) { cancel(event); };
    }
}).setCriteria("${msg}").setFormatted(true);