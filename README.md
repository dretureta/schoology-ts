# schoology-ts

> TypeScript client for the Schoology API with full type safety, OAuth 1.0a authentication, and automatic pagination.

## Features

- **100% TypeScript** — Strict mode, full type coverage, no `any`
- **OAuth 1.0a** — HMAC-SHA1 signature for secure authentication
- **Automatic Pagination** — Async iterator for seamless iteration over large datasets
- **Rate Limit Handling** — Exponential backoff with configurable retries
- **8 API Resources** — Users, Courses, Sections, Assignments, Submissions, Grades, Discussions, Events

## Install

```bash
npm install schoology-ts
```

## Quick Start

```ts
import { SchoologyClient } from 'schoology-ts';

const client = new SchoologyClient({
  apiKey: process.env.SCHOOLOGY_API_KEY!,
  apiSecret: process.env.SCHOOLOGY_API_SECRET!,
});

// List users
const { data: users } = await client.users.list({ section_id: 123 });

// Get single user
const user = await client.users.get(12345);

// Automatic pagination
for await (const user of client.users.listAll({ section_id: 123 })) {
  console.log(user.display_name);
}

// Create a course
const course = await client.courses.create({
  title: 'Mathematics 101',
  description: 'Introduction to algebra',
});
```

## Documentation

- [Getting Started Guide](./GUIDE.md) — Setup, authentication, and basic usage
- [API Reference](./GUIDE.md#api-reference) — All available methods
- [Changelog](./CHANGELOG.md) — Release history

## License

MIT
