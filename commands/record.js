const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { EndBehaviorType, createAudioResource } = require('@discordjs/voice')
const { createWriteStream } = require('node:fs');
const { convertAudio } = require('../utils/audioConverter');
const { createTranscription } = require('../utils/speechToText');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("record")
        .setDescription("Record audio activity in the Voice Channel."),
    async execute({client, interaction}) {
        const embed = new EmbedBuilder();
        const channel = interaction.member.voice.channel;
        
        if (!channel) return interaction.reply("You need to be in a Voice Channel to execute this command.");
        
        const queue = client.player.nodes.create(interaction.guildId);
        await interaction.deferReply();

        try {
            await queue.connect(interaction.member.voice.channelId, {
                deaf: false
            });
            
            const stream = queue.voiceReceiver.recordUser(interaction.member.id, {
                mode: 'pcm',
                end: EndBehaviorType.AfterSilence
            });
            
            const audioFileName = `../audios/rec-${interaction.member.id}_${Math.floor(+Date.now()/1000)}.wav`;

            await convertAudio(stream, audioFileName)
            .then(async() => {
                if(interaction.isRepliable()) {
                    const transcription = await createTranscription(audioFileName);
                    embed
                        .setColor('Blue')
                        .setDescription(transcription)
                    return interaction.followUp({embeds: [embed]});
                }
            })
            .catch((err) => {
                console.error('Error converting audio:', err);
                return interaction.followUp('Something went wrong');
            });

            queue.delete();
        } catch {
            return interaction.followUp('Failed to connect to your channel');
        }
        return;
    },
};