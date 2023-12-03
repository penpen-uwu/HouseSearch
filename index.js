register("command", (...arg) => {
    if (arg == undefined || arg.join(" ").removeFormatting() == "help" || arg.join(" ").removeFormatting() == "") {
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
        ChatLib.chat("/hs <search>");
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
    } else {
        test = new Thread(() => {
            ChatLib.chat(`Searching for \"${arg.join(" ").removeFormatting()}\"...`);
            let houses = JSON.parse(FileLib.getUrlContent(`https://housing.menu/houses?search=${arg.join("+").removeFormatting()}&amount=5&orderby=last_updated`));
            if (houses["total"] == 0) {
                ChatLib.chat("No houses found")
            } else {
                ChatLib.chat(ChatLib.getChatBreak("&e&m "));
                houses["rows"].forEach((element) => {
                    if (element["alive"]) {
                        indicator = "&a●";
                    } else {
                        indicator = "&c●";
                    }
                    ChatLib.chat(`${element["name"]}&r, by ${element["creator"]} ${indicator}`);
                    msg = new TextComponent("&e&lClick here to join!").setClick("run_command", `/visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name_raw"]}`).setHover("show_text", `Click here to run /visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name_raw"]}`)
                    ChatLib.chat(msg);
                    ChatLib.chat("");
                });
                ChatLib.chat("&7Only showing up to 5 results");
                ChatLib.chat(ChatLib.getChatBreak("&e&m "));
            }
            test = undefined;
        }).start()
    }
}).setCommandName("hs").setAliases("housesearch", "hsearch");