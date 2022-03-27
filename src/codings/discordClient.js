const djs = require("discord.js");
const eventReader = require("./../events/eventReader.js");
const reader = require("./reader.js");
const conditionParser = require("./conditionParser.js");
const throwError = require("./error.js");
const fs = require('fs');
const PATH = require('path');
const { loadedFunctions } = require("./../functions/functionReader.js");

class Client {
    constructor (data) {
        let {token, intents = "all", prefix, debug = false, respondBots = true} = data; 

        const allIntents = ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_SCHEDULED_EVENTS"];

        if (intents === "all") intents = allIntents;
        
        const client = new djs.Client({
            intents,
            partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"]
        });

        client.once("ready", () => {
            client.user.setPresence(this.data.status);

            console.log(`\x1b[32mHYTE\x1b[32;1mSCRIPT\x1b[0m | \x1b[35;1m${loadedFunctions.size || 0} functions \x1b[0mloaded.`);
            console.log("\x1b[32mHYTE\x1b[32;1mSCRIPT\x1b[0m | \x1b[0mClient Initialized.");
            console.log("HyTera Development - \x1b[34;1mhttps://discord.gg/9DPmE8azm2\x1b[0m");

        });
        
        this.data = {
            options: {
                token,
                prefix,
                intents,
                respondBots,
                debug
            },
            client,
            djs,
            commandManager: {
                default: new Map(),
                functional: new Map(),
                ready: new Map(),
                memberJoin: new Map(),
                memberLeave: new Map()
            },
            loadedFunctions,
            throwError: new throwError(),
            reader: new reader(),
            conditionParser: new conditionParser(),
            status: {}
        };

        client.login(token);
    };

    addCommands(...commandsData) {
        console.log("\x1b[30;1m| ---+= \x1b[36mCOMMANDS (main file) \x1b[30;1m=+--- |\x1b[0m");
        for (const commandData of commandsData) {
            let {name, type = "default", code, alwaysExecute = false, ignorePrefix = false, executeOnDM = false} = commandData;
            
            if (typeof code !== "string") return console.error(`\x1b[30;1m| \x1b[31m"${name || "unknown"}" [${type || "unknown"}]: invalid code provided!\n\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`);
            
            if (!this.data.commandManager[type]) return console.error(`\x1b[30;1m| \x1b[31m"${name || "unknown"}": the command type "${type || "unknown"}" doesn't exists!\n\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`)
            
            this.data.commandManager[type].set(name.toLowerCase(), {code, alwaysExecute, ignorePrefix, executeOnDM});
            
            console.log (`\x1b[30;1m| \x1b[32;1m"${name || "unknown"}" [${type}]: successfully loaded!`);
            console.log(`\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`);
        };
    };

    addEvents(...events) {
        for (const event of events) {
            let runEvent = eventReader.loadedEvents.get(event.toLowerCase());
            if (!runEvent) {
                if (this.data.options.debug === true) console.log("\u001b[31mDEBUG\u001b[0m | Invalid Event: " + event || "unknown");
                return;
            };

            runEvent(this.data);

            if (this.data.options.debug === true) console.log("\u001b[31mDEBUG\u001b[0m | Event Added: " + event || "unknown");
        }
    };

    async readFolder(path) {
        async function getFiles(path) {
            fs.access(path, fs.constants.F_OK, (err) => {
                if (err) console.error(`\x1b[Cannot read ${path}: directory does not exists.`);
                return;
            });

            let files = await fs.promises
            .readdir(path, {withFileTypes: true})
            .then((f) => {
                return f.map((d) => {
                    d.name = `${path}${PATH.sep}${d.name}`;

                    return d;
                });
            });

            let types = {
                files: files.filter(file => file.isFile()),
                dirs: files.filter(file => file.isDirectory())
            };

            for (let dir of types.dirs) {
                let dirFiles = await getFiles(dir.name);

                types.files.push(...dirFiles);
            };

            return types.files;
        };

        let files = await getFiles(path);

        console.log(`\x1b[30;1m| -+= \x1b[36mCOMMANDS (folder reader) \x1b[30;1m=+- |`);

        for (let file of files) {

            fs.realpath(path, (err, dir) => {
                if (err) console.log(`\x1b[30;1m| \x1b[31mFailed to read ${dir + file.name.replace(path, '')}\n\x1b[30;1m|\n| ${err}\n\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`);

                let cmdData;

                try {
                    cmdData = require(dir + file.name.replace(path, ''));
                    
                    let optionsArr = [];

                    if (Array.isArray(cmdData)) {
                        optionsArr.push(...cmdData);
                    } else {
                        optionsArr.push(cmdData);
                    };

                    for (const options of optionsArr) {
                        let {name, type = "default", code, alwaysExecute = false, ignorePrefix = false, executeOnDM = false} = options;
                        
                        if (typeof code !== "string") return console.error(`\x1b[30;1m| \x1b[31m"${name || "unknown"}" [${type || "unknown"}]: invalid code provided!\n\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`);
            
            if (!this.data.commandManager[type]) return console.error(`\x1b[30;1m| \x1b[31m"${name || "unknown"}": the command type "${type || "unknown"}" doesn't exists!\n\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`)
            
            this.data.commandManager[type].set(name ? name.toLowerCase() : name, {code, alwaysExecute, ignorePrefix, executeOnDM});
            
            console.log (`\x1b[30;1m| \x1b[32;1m"${name || "unknown"}" [${type}]: successfully loaded!`);
            console.log(`\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`);
                    };
                } catch (err) {
                    console.log(`\x1b[30;1m| \x1b[31mFailed to read ${dir + file.name.replace(path, '')}\n\x1b[30;1m|\n| ${err}\n\x1b[30;1m| -------------+=<>=+------------- |\x1b[0m`);
                };
        });

        };
    };
    setStatus(options) {
        let {text: name, type = 'PLAYING', status = 'online'} = options;
        this.data.status = {
            activities: [{
                name,
                type
            }],
            status
        };
    };
};

module.exports = Client;