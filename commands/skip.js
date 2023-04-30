const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip current song."),
	async execute({client, interaction}) {
        const embed = new EmbedBuilder();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply("You need to be in a Voice Channel to execute this command.");
        await interaction.deferReply();

        try {
            const queue = useQueue(interaction.guild.id);
            const currentSong = queue.currentTrack;
            const nextSong = queue.tracks.data[0];

            if(!nextSong || !currentSong) {
                queue.delete();
                embed
                    .setDescription('No other song is enqueued.')
                    .setColor('Red')
            }
            else {
                queue.node.skip();

                embed
                    .setColor('Blue')
                    .setThumbnail(nextSong.thumbnail)
                    .setTitle(`${nextSong.title} - from ${nextSong.source}`)
                    .setDescription(`Song skipped.**\n\nNow playing: [${nextSong.title}](${nextSong.url})**`)
                    .setFooter({text: `Duration: ${nextSong.duration}`})
                    .setAuthor({
                        name: nextSong.author, iconURL: nextSong.thumbnail, url: nextSong.url
                    })
            }
            
            return interaction.followUp({embeds: [embed]});
        } catch (e) {
            console.log(e)
            return interaction.followUp(`Something went wrong.`);
        }
	}
};