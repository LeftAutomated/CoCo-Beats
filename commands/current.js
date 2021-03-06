module.exports = {
    name: 'current',
    description: 'Display current song',
    async execute(interaction, player){
        if(!interaction.member.voice.channelId)
            return await interaction.reply({
                content: "Why you not in VC -_-",
                ephemeral: true,
            });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) 
            return await interaction.reply({ 
                content: "Why you not in the same VC -_-", 
                ephemeral: true, 
            });

        await interaction.deferReply();

        const queue = player.getQueue(interaction.guildId);

        if(!queue || !queue.playing)
            return await interaction.followUp({ 
                content: "No song is playing noob", 
            });

        const elapsedTime = queue.createProgressBar();
        const isLooped = (queue.repeatMode) ? "Looped" : "Not Looped";
        
        return await interaction.followUp({
            embeds: [
                {
                    title: 'Current Song',
                    description: `**${queue.current.title}**`,
                    fields: [
                        {
                            name: `\u200b`,
                            value: `${elapsedTime}`
                        },
                        {
                            name: '\u200b',
                            value: `${isLooped}`
                        }
                    ],
                    color: 0x2F4562,
                }
            ]
        });

    }
}