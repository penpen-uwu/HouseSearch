devmode = JSON.parse(FileLib.read("HouseSearch", "config.json"))["devmode"];

register("command", (...arg) => {
    if (arg == undefined || arg == "help" || arg.join(" ").removeFormatting() == "") { //check if the search arguments are empty or help
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
        ChatLib.chat("/hs <search>");
        ChatLib.chat("/hs devmode &7- &fenables developer mode")
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
    } else if (arg == "devmode") {
        devmode = !devmode;
        FileLib.write("HouseSearch", "config.json", `{"devmode": ${devmode}}`);
        ChatLib.chat("Toggled showing housing.menu ID/Housing ID")
    } else {
        thread = new Thread(() => { //make new thread so game doesnt lag 
            ChatLib.chat(`Searching for \"${arg.join(" ").removeFormatting()}\"...`);
            let houses = JSON.parse(FileLib.getUrlContent(`https://housing.menu/houses?search=${arg.join("+").removeFormatting()}&amount=5&orderby=last_updated`)); //use housing.menu to get json data of houses with the arguments
            if (houses["total"] == 0) {
                ChatLib.chat("No houses found")
            } else {
                ChatLib.chat(ChatLib.getChatBreak("&e&m "));
                houses["rows"].forEach((element) => {
                    if (element["alive"]) { //make indicator text for if the house is active (has server or not)
                        indicator = "&a●&r";
                    } else {
                        indicator = "&c●&r";
                    }
                    houseinfomsg = new TextComponent(`${element["name"]}&r, by ${element["creator"]} ${indicator}`).setHover("show_text", `${element["name"]}\n&7Owner: ${element["creator"]}\n\n&7Cookies: &6${element["cookies"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n\n&7Players: &b${element["players"]}\n\n&7Last Updated: &a${element["last_updated"].replace("T", "-").replace(".000Z", " UTC")}${devmode ? "\n&8" : ""}${devmode ? element["id"] : ""}`)
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
                    ChatLib.chat(houseinfomsg);
                    joinmsg = new TextComponent("&e&lClick here to join!").setClick("run_command", `/visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name_raw"]}`).setHover("show_text", `Click here to run /visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name_raw"]}`)
                    /* example
                    Click here to join!
                    (when hovered)
                    Click here to run /visit Penpenpenpenpen Blue House
                    */
                    ChatLib.chat(joinmsg);
                    ChatLib.chat("");
                });
                ChatLib.chat("&7Only showing up to 5 results");
                ChatLib.chat("&7Hover over House names for more info");
                ChatLib.chat(ChatLib.getChatBreak("&e&m "));
            }
            thread = undefined;
        }).start()
    }
}).setCommandName("hs").setAliases("housesearch", "hsearch").setTabCompletions("help", "devmode");