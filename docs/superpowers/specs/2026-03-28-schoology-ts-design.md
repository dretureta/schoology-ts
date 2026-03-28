# Schoology TypeScript Client — Design Spec

## Overview

A TypeScript library for connecting to Schoology's API. Supports API Key + Secret authentication (server-to-server integration). Full API coverage with typed resources and automatic pagination.

## Goals

- TypeScript strict mode throughout — no `any`
- Server-side apps and CLI tools
- All Schoology API resources fully typed
- Automatic pagination via `listAll()` async iterator
- OAuth 1.0a HMAC-SHA1 signature for request authentication
- Rate limit handling with configurable exponential backoff

---

## Architecture

```
src/
├── client.ts           # SchoologyClient (constructor, auth, request handler)
├── types/              # All TypeScript strict types
│   ├── user.ts
│   ├── course.ts
│   ├── section.ts
│   ├── assignment.ts
│   ├── submission.ts
│   ├── grade.ts
│   ├── discussion.ts
│   ├── event.ts
│   └── index.ts
├── resources/          # Methods per resource
│   ├── users.ts
│   ├── courses.ts
│   ├── sections.ts
│   ├── assignments.ts
│   ├── submissions.ts
│   ├── grades.ts
│   ├── discussions.ts
│   ├── events.ts
│   └── index.ts
├── pagination.ts       # Cursor/page pagination helpers
├── errors.ts           # SchoologyApiError, SchoologyAuthError
└── index.ts            # Public exports
```

---

## Public API

### Constructor

```ts
const client = new SchoologyClient({
  apiKey: process.env.SCHOOLOGY_API_KEY!,
  apiSecret: process.env.SCHOOLOGY_API_SECRET!,
  baseUrl?: 'https://api.schoology.com/v1',  // default
  maxRetries?: 3,                              // rate limit retry attempts
});
```

### Client Methods (per resource)

Each resource exposes: `list()`, `get()`, `create()`, `update()`, `delete()`

```ts
// Users
client.users.list(params?: ListUsersParams): Promise<SchoologyListResponse<User>>
client.users.get(uid: number | string): Promise<User>

// Courses
client.courses.list(params?: ListCoursesParams): Promise<SchoologyListResponse<Course>>
client.courses.get(cid: number | string): Promise<Course>
client.courses.create(data: CreateCourseInput): Promise<Course>
client.courses.update(cid: number | string, data: UpdateCourseInput): Promise<Course>
client.courses.delete(cid: number | string): Promise<void>

// Sections
client.sections.list(params?: ListSectionsParams): Promise<SchoologyListResponse<Section>>
client.sections.get(sid: number | string): Promise<Section>
client.sections.create(data: CreateSectionInput): Promise<Section>
client.sections.update(sid: number | string, data: UpdateSectionInput): Promise<Section>
client.sections.delete(sid: number | string): Promise<void>

// Assignments
client.assignments.list(params?: ListAssignmentsParams): Promise<SchoologyListResponse<Assignment>>
client.assignments.get(aid: number | string): Promise<Assignment>
client.assignments.create(courseId: number | string, data: CreateAssignmentInput): Promise<Assignment>
client.assignments.update(aid: number | string, data: UpdateAssignmentInput): Promise<Assignment>
client.assignments.delete(aid: number | string): Promise<void>

// Submissions
client.submissions.list(params?: ListSubmissionsParams): Promise<SchoologyListResponse<Submission>>
client.submissions.get(sid: number | string): Promise<Submission>
client.submissions.create(aid: number | string, data: CreateSubmissionInput): Promise<Submission>
client.submissions.update(sid: number | string, data: UpdateSubmissionInput): Promise<Submission>

// Grades
client.grades.list(params?: ListGradesParams): Promise<SchoologyListResponse<Grade>>
client.grades.get(gid: number | string): Promise<Grade>
client.grades.create(data: CreateGradeInput): Promise<Grade>
client.grades.update(gid: number | string, data: UpdateGradeInput): Promise<Grade>

// Discussions
client.discussions.list(params?: ListDiscussionsParams): Promise<SchoologyListResponse<Discussion>>
client.discussions.get(did: number | string): Promise<Discussion>
client.discussions.create(sectionId: number | string, data: CreateDiscussionInput): Promise<Discussion>
client.discussions.update(did: number | string, data: UpdateDiscussionInput): Promise<Discussion>
client.discussions.delete(did: number | string): Promise<void>

// Events
client.events.list(params?: ListEventsParams): Promise<SchoologyListResponse<Event>>
client.events.get(eid: number | string): Promise<Event>
```

### Pagination

**Automatic — `listAll()` async iterator:**

```ts
for await (const user of client.users.listAll({ section_id: 123 })) {
  console.log(user.display_name);
}
```

**Manual — with cursor:**

```ts
const page1 = await client.users.list({ section_id: 123, limit: 100 });
// page1.data = User[]
// page1.links.next = URL string for next cursor
const page2 = await client.users.list({ section_id: 123, cursor: page1.links.next });
```

### Error Handling

```ts
try {
  const user = await client.users.get(999);
} catch (error) {
  if (error instanceof SchoologyAuthError) {
    // 401 — bad API key/secret
  } else if (error instanceof SchoologyApiError) {
    // API returned error: error.status, error.message, error.code
  }
}
```

**Rate limit (429):** Automatic exponential backoff with configurable max retries.

---

## Authentication

Schoology uses **OAuth 1.0a** with HMAC-SHA1 signature.

Each request includes:
- `Authorization: OAuth` header with: `oauth_consumer_key`, `oauth_token`, `oauth_signature`, `oauth_signature_method`, `oauth_timestamp`, `oauth_nonce`, `oauth_version`

Signature is computed per request using `apiSecret` + `apiSecret` (token secret is empty for API key auth).

---

## Type Examples

```ts
// User
interface User {
  uid: number;
  display_name: string;
  short_display_name: string;
  email: string;
  primary_email?: string;
  school_id?: number;
  role: 'student' | 'teacher' | 'admin' | 'parent' | 'observer';
  created?: number;  // timestamp
  updated?: number;
}

// Course
interface Course {
  id: number;
  title: string;
  description?: string;
  code?: string;
  section_ids?: number[];
  admin_ids?: number[];
  created?: number;
  updated?: number;
}

// SchoologyListResponse (all list endpoints)
interface SchoologyListResponse<T> {
  data: T[];
  links: {
    next?: string;
    prev?: string;
  };
  total?: number;
}
```

---

## Testing Strategy

- **Unit tests** per resource using `nock` to mock HTTP responses
- **OAuth signature tests** — verify signature computation matches Schoology's expected format
- **Pagination tests** — verify cursor handling and `listAll()` iterator
- **Error tests** — 401, 429, 500 responses

---

## File Structure

```
src/
├── index.ts                    # exports: SchoologyClient, types, errors
├── client.ts                   # main client class
├── types/
│   ├── index.ts
│   ├── user.ts
│   ├── course.ts
│   ├── section.ts
│   ├── assignment.ts
│   ├── submission.ts
│   ├── grade.ts
│   ├── discussion.ts
│   └── event.ts
├── resources/
│   ├── index.ts
│   ├── users.ts
│   ├── courses.ts
│   ├── sections.ts
│   ├── assignments.ts
│   ├── submissions.ts
│   ├── grades.ts
│   ├── discussions.ts
│   └── events.ts
├── pagination.ts
└── errors.ts
tests/
├── client.test.ts
├── resources/
│   ├── users.test.ts
│   ├── courses.test.ts
│   └── ...
├── pagination.test.ts
└── oauth-signature.test.ts
```

---

## Dependencies (minimal)

- `typescript` — strict types
- `undici` — HTTP client (built-in Node.js)
- `form-data` — for multipart uploads (assignments with attachments)
- `nock` — test HTTP mocking

**Dev:**
- `vitest` — test runner
- `typescript` + tsconfig strict
