export const AppEnvironmentSchema = {
    $schema: 'http://json-schema.org/schema#',
    title: 'Product',
    type: 'object',
    required: ['production'],
    properties: {
        production: {
            type: 'boolean',
            description: 'It defines if the SPA runs in production mode or not'
        },
        debugMode: {
            type: 'string',
            enum: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF']
        }
    }
};

