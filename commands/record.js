const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { EndBehaviorType, createAudioResource } = require('@discordjs/voice')
const { createWriteStream } = require('node:fs');
const {Leopard} = require("@picovoice/leopard-node");
const {apiKey} = require('../config.json');
const handle = new Leopard(apiKey);
const path = require("node:path");

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
            // make sure to connect to a voice channel which you want to record audio from
            await queue.connect(interaction.member.voice.channelId, {
                deaf: false // make sure self deaf is false otherwise bot wont hear your audio
            });
        } catch {
            return interaction.followUp('Failed to connect to your channel');
        }

        const stream = queue.voiceReceiver.recordUser(interaction.member.id, {
            mode: 'pcm', // record in pcm format
            end: EndBehaviorType.AfterSilence // stop recording once user stops talking
        });

        const writer = stream.pipe(createWriteStream(`./rec.pcm`)); // write the stream to a file
        
        writer.once('finish', async() => {
            // if (interaction.isRepliable())
            try {
                if(interaction.isRepliable()) {
                    queue.node.playRaw(createAudioResource(path.join(__dirname, '../rec.pcm')));
                    embed
                        .setColor('Green')
                        .setDescription('Audio recorded and saved.')
                    return interaction.followUp({embeds: [embed]});
                }
            }
            catch(err) {
                console.log(err);
                return interaction.followUp('Something went wrong');
            }
            // queue.delete(); // cleanup
        });

        return;
	},
};