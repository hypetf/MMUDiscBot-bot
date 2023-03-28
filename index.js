require('dotenv').config();
const {
    TOKEN,
    CLIENT_ID
} = process.env;
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v10');
const { Player } = require('discord-player');
const fs = require("node:fs");
const path = require("node:path");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname,"commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a require "data" or "execute" property`);
    }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Currently live in ${client.guilds.cache.size} guild${client.guilds.cache.size > 1 ? 's' : ''}.`)
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

    try {
        await command.execute({client, interaction});
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
});

client.login(TOKEN);