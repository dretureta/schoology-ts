# schoology-ts

TypeScript client for Schoology API with full type safety, OAuth 1.0a authentication, and automatic pagination.

## Install

```bash
npm install schoology-ts
```

## Usage

```ts
import { SchoologyClient } from 'schoology-ts';

const client = new SchoologyClient({
  apiKey: process.env.SCHOOLOGY_API_KEY!,
  apiSecret: process.env.SCHOOLOGY_API_SECRET!,
});

// List users
const users = await client.users.list({ section_id: 123 });

// Automatic pagination
for await (const user of client.users.listAll({ section_id: 123 })) {
  console.log(user.display_name);
}
```
