module.exports = {
    name: 'play',
    description: 'Play song',
    options:[
        {
            name: 'query',
            type: 'STRING',
            description: 'Desired song',
            required: true,
        },
    ],
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

        const query = interaction.options.get("query").value;
        const queue = player.createQueue(interaction.guild, {
            metadata:{
                channel: interaction.channel,
            },
        });

        try{
            if(!queue.connection)
                await queue.connect(interaction.member.voice.channel);
        }
        catch(error){
            console.error(error);
            queue.destroy();
            return await interaction.reply({ 
                content: "I couldn't join -_-", 
                ephemeral: true 
            });
        }

        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);

        if(!track)
            return await interaction.followUp({
                content: `Song **${query}** nonexistent -_-`,
            });
            
        queue.play(track);

        return await interaction.followUp({
            content: `Loading song **${track.title}**`,
        });
    },
}