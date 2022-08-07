module.exports = {
    description: 'Deletes messages that are newer than 2 weeks in a channel.',
    usage: 'messageCount | channelId? | guildId?',
    parameters: [
        {
            name: 'Message count',
            description: 'How many messages to be deleted.',
            optional: 'false',
            defaultValue: 'none'
        },
        {
            name: 'Channel ID',
            description: 'The channel to delete messages.',
            optional: 'true',
            defaultValue: 'Current channel ID'
        },
        {
            name: 'Guild ID',
            description: 'The guild which the channel belongs to.',
            optional: 'true',
            defaultValue: 'Current guild ID'
        }
    ],
    run: async (d, messageCount, channelId = d.channel?.id, guildId = d.guild?.id, returnDeletedCount = 'false') => {
        if (messageCount == undefined) return d.throwError.required(d, 'message count')

        if (isNaN(messageCount) || Number(messageCount) <= 0) return d.throwError.invalid(d, 'message count', messageCount)

        const guild = d.client.guilds.cache.get(guildId)
        if (!guild) return d.throwError.invalid(d, 'guild ID', guildId)

        const channel = guild.channels.cache.get(channelId)
        if (!channel) return d.throwError.invalid(d, 'channel ID', channelId)

        const messages = await channel.bulkDelete(Number(messageCount), true).catch(e => d.throwError.func(d, e.message))

        return returnDeletedCount === 'true' ? messages?.size : undefined
    }
};