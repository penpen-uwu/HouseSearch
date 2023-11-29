register("command", (...arg) => {
    if (arg == undefined || arg.join(" ") == "help") {
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
        ChatLib.chat("/hs <search>");
        ChatLib.chat(ChatLib.getChatBreak("&e&m "));
    } else {
        test = new Thread(() => {
            ChatLib.chat(`Searching for \"${arg.join(" ")}\"...`);
            let houses = JSON.parse(FileLib.getUrlContent(`https://housing.menu/houses?search=${arg.join("+")}&amount=5&orderby=id`));
            if (houses["total"] == 0) {
                ChatLib.chat("No houses found")
            } else {
                ChatLib.chat(ChatLib.getChatBreak("&e&m "));
                houses["rows"].forEach((element) => {
                    ChatLib.chat(`${element["name"]}&r, by ${element["creator"]}`);
                    msg = new TextComponent("&e&lClick here to join!").setClick("run_command", `/visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name"].removeFormatting()}`).setHover("show_text", `Click here to run /visit ${element["creator"].removeFormatting().replace(/\[[\w+\+-]+] /, "").trim()} ${element["name"].removeFormatting()}`)
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