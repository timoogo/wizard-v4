
export type AvailableEntity = 'User' | 'Client' | 'Example' | 'Related';

export type User = { id: 'integer'; username: 'string'; email: 'string'; password_hash: 'string' };

export type Client = { id: 'integer'; name: 'string'; email: 'string'; phone: 'string' };

export type Example = { id: 'integer'; stringField: 'string'; intField: 'integer'; floatField: 'number'; booleanField: 'boolean'; dateTimeField: 'string'; jsonField: 'number,string,boolean,object,array,null'; bytesField: 'string'; decimalField: 'number'; bigintField: 'integer'; color: 'string'; optionalField: 'string,null'; related: 'undefined' };

export type Related = { id: 'integer'; name: 'string'; examples: 'array' };
