const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current queue."),
	async execute({client, interaction}) {
        const embed = new EmbedBuilder();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply("You need to be in a Voice Channel to execute this command.");
        await interaction.deferReply();

        try {
            const queue = useQueue(interaction.guild.id);
            const currentSong = queue.currentTrack;

            if(queue.node.isPaused) {
                queue.node.resume();
                embed
                    .setDescription(`Resumed current song: **${currentSong.title} - ${currentSong.author}**.`)
                    .setColor('Green')
            }
            else {
                embed
                    .setDescription('Current queue is already playing.')
                    .setColor('Blue')
            }

            return interaction.followUp({embeds: [embed]});
        } catch (e) {
            console.log(e)
            return interaction.followUp(`Something went wrong.`);
        }
	},
};