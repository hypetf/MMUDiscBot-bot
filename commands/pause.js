const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current queue."),
	async execute({client, interaction}) {
        const embed = new EmbedBuilder();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply("You need to be in a Voice Channel to execute this command.");
        await interaction.deferReply();

        try {
            const queue = useQueue(interaction.guild.id);
            const currentSong = queue.currentTrack;
            if(queue.node.isPlaying) {
                queue.node.pause();
                embed
                    .setDescription(`Paused current song: **${currentSong.title} - ${currentSong.author}**.`)
                    .setColor('Yellow')
            }
            else {
                embed
                    .setDescription('Current queue is already paused.')
                    .setColor('Yellow')
            }

            return interaction.followUp({embeds: [embed]});
        } catch (e) {
            console.log(e)
            return interaction.followUp(`Something went wrong.`);
        }
	},
};