module.exports = {
    description: 'Sets a new name to the client user.',
    usage: 'name',
    parameters: [
        {
            name: 'Name',
            description: 'The name string.',
            optional: 'false',
            defaultValue: 'none'
        }
    ],
    run: async (d, name) => {
        if (name == undefined) return d.throwError.required(d, 'name')

        await d.client.user.setUsername(name).catch(e => d.throwError.func(d, e.message))
    }
}