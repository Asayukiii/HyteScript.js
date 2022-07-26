module.exports = {
    description: 'Returns index of element which matches text.',
    usage: 'name | text',
    parameters: [
        {
            name: 'Name',
            description: 'The array name.',
            optional: 'false',
            defaultValue: 'none'
        },
        {
            name: 'Text',
            description: 'The element text.',
            optional: 'false',
            defaultValue: 'none'
        }
    ],
    run: async (d, name, text) => {
        if (name == undefined) return d.throwError.required(d, 'name')
        if (text == undefined) return d.throwError.required(d, 'text')

        if (!d.data.arrays[name]) return d.throwError.invalid(d, 'array name', name);

        return d.data.arrays[name].indexOf(text) + 1
    }
};