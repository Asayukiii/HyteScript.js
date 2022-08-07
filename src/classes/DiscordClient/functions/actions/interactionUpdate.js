module.exports = {
    description: 'Updates the message which sent interaction.',
    usage: 'message',
    parameters: [
        {
            name: 'Message',
            description: 'The message to be sent (support functions that sets a message option).',
            optional: 'false',
            defaultValue: 'none'
        }
    ],
    parseParams: false,
    run: async (d, message) => {
        if (!['interaction', 'buttonInteraction', 'selectMenuInteraction', 'modalSubmitInteraction'].includes(d.eventType)) return d.throwError.notAllowed(d, 'interaction, buttonInteraction, selectMenuInteraction or modalSubmitInteraction types')

        if (message == undefined) return d.throwError.required(d, 'message')

        let updateObj = await d.utils.parseMessage(d, message)
        if (!updateObj) return;

        await d.interaction.update(updateObj).catch(e => d.throwError.func(d, e.message))
}
};