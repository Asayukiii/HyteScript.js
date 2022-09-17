module.exports = {
    run: async (d, name, dbName, memberId = d.authorId, guildId = d.guild?.id) => {
        let database = d.databases[dbName]

        if (!database) return new d.error("invalid", d, 'database name', dbName)

        if (database.entries[name] == undefined) return new d.error("custom", d, `entry "${name}" is not set in database "${dbName}"`)

        let guild = d.client.guilds.cache.get(guildId)
        if (!guild) return new d.error("invalid", d, 'guild ID', guildId)

        let member = guild.members.cache.get(memberId)
        if (!member) return new d.error("custom", d, `member with ID "${memberId}" is not in provided guild.`)

        database.delete(name, `_member_${memberId}_${guildId}`)
    }
};