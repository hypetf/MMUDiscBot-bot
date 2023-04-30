const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get latency"),
	async execute({client, interaction}) {
		await interaction.reply(`🏓 | Latency is: **${Math.abs(Date.now() - interaction.createdTimestamp)}ms.**`)
	},
};