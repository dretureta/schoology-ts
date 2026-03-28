# schoology-ts

> TypeScript client for the Schoology API with full type safety, OAuth 1.0a authentication, and automatic pagination.

[![npm version](https://img.shields.io/npm/v/schoology-ts)](https://www.npmjs.com/package/schoology-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Status](https://github.com/dretureta/schoology-ts/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/dretureta/schoology-ts/actions/workflows/test.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![node](https://img.shields.io/badge/node-18+-green)](https://nodejs.org/)

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

**Requirements:** Node.js 18+ (uses native `fetch`)

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

## Available Resources

| Resource | Methods |
|----------|---------|
| `users` | `list`, `get`, `listAll` |
| `courses` | `list`, `get`, `create`, `update`, `delete`, `listAll` |
| `sections` | `list`, `get`, `create`, `update`, `delete`, `listAll` |
| `assignments` | `list`, `get`, `create`, `update`, `delete`, `listAll` |
| `submissions` | `list`, `get`, `create`, `update`, `listAll` |
| `grades` | `list`, `get`, `create`, `update`, `listAll` |
| `discussions` | `list`, `get`, `create`, `update`, `delete`, `listAll` |
| `events` | `list`, `get`, `listAll` |

## Examples

Practical scripts available in the [`examples/`](./examples/) directory:

```bash
# List students in a section
SECTION_ID=123 npx tsx examples/list-students.ts

# Create an assignment
COURSE_ID=456 npx tsx examples/create-assignment.ts

# Bulk grade submissions
ASSIGNMENT_ID=789 STUDENT_GRADES="1:95,2:87" npx tsx examples/bulk-grade.ts

# Export grades to CSV
COURSE_ID=456 npx tsx examples/export-grades.ts > grades.csv
```

## Documentation

- [Getting Started Guide](./GUIDE.md) — Setup, authentication, and basic usage
- [API Reference](./GUIDE.md#api-reference) — All available methods
- [Changelog](./CHANGELOG.md) — Release history

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Type check
npm run lint
```

## License

MIT © [Denys R](https://github.com/dretureta)
