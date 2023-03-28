const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song from YouTube.")
        .addStringOption(option =>
            option
                .setName("song")
                .setDescription("Enter the URL of the song/playlist or just search by song name.")
                .setRequired(true)
        ),
	async execute({client, interaction, songFromSite}) {
        const embed = new EmbedBuilder();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply("You need to be in a Voice Channel to play a song.");
        const queue = useQueue(interaction.guild.id);
        const query = interaction.options.getString('song', true);
        await interaction.deferReply();

        try {
            if(query.includes('test')) {
                console.log('test')
                const filePath = 'C:/Users/Rabba/Documents/GitHub/mmu_musicbot/botv2/song.mp3';

                await client.player.play(channel, filePath, {
                    // in order to play local files, we need to explicitly tell discord-player to search that path in our file system
                    searchEngine: QueryType.FILE // QueryType.FILE tells discord-player to play from our file system,
                    // ... (other options if you need)
                });
                
                embed
                    .setColor('Blurple')
                    .setDescription(`Playing local audio file`)
                return interaction.followUp({embeds: [embed]});
            }
            const { track } = await client.player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });

            if(query.includes('playlist')) {
                console.log('playlist')
                embed
                    .setColor('Blurple')
                    .setThumbnail(track.thumbnail)
                    .setTitle(`Playlist detected`)
                    .setDescription(`**[${track.title}](${track.url})** is currently playing`)
                    .setFooter({text: `Duration: ${track.duration}`})
                    .setAuthor({
                        name: track.author, iconURL: track.thumbnail, url: track.url
                    })
            }
            else {
                console.log('normal')
                embed
                    .setColor('Blue')
                    .setThumbnail(track.thumbnail)
                    .setTitle(`${track.title} - from ${track.raw.source}`)
                    .setDescription(`**[${track.title}](${track.url})** has been added to the queue`)
                    .setFooter({text: `Duration: ${track.duration}`})
                    .setAuthor({
                        name: track.author, iconURL: track.thumbnail, url: track.url
                    })
            }

            return interaction.followUp({embeds: [embed]});
        } catch (e) {
            console.log(e)
            return interaction.followUp(`Something went wrong.`);
        }
	}
};