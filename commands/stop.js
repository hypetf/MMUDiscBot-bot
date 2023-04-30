const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops playing the current queue and leaves the voice channel."),
	async execute({client, interaction}) {
        const embed = new EmbedBuilder();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply("You need to be in a Voice Channel to execute this command.");
        await interaction.deferReply();

        try {
            const queue = useQueue(interaction.guild.id);
            if(!queue) 
                return;
            queue.delete();
            embed
                .setColor('Red')
                .setDescription('I left the channel.');
            return interaction.followUp({embeds: [embed]});
        } catch (e) {
            console.log(e)
            return interaction.followUp(`Something went wrong.`);
        }
	},
};