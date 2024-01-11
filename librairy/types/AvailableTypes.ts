
export type AvailableEntity = 'User' | 'Book';

export type User = { id: 'integer'; username: 'string'; email: 'string'; password_hash: 'string' };

export type Book = { id: 'integer'; title: 'string'; description: 'string'; author: 'string'; price: 'number'; image: 'string'; user_id: 'integer' };
