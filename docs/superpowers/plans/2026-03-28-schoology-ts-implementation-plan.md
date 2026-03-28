# Schoology TypeScript Client — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A TypeScript library with full Schoology API coverage, OAuth 1.0a auth, automatic pagination, and strict TypeScript types.

**Architecture:** Functional client with resource-based methods (list, get, create, update, delete). OAuth 1.0a HMAC-SHA1 signature per request. Async iterator pagination via `listAll()`. Error hierarchy with auto-retry on rate limits.

**Tech Stack:** TypeScript (strict), Node.js native fetch (undici), vitest, nock

---

## File Structure

```
src/
├── index.ts
├── client.ts
├── errors.ts
├── pagination.ts
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
└── resources/
    ├── index.ts
    ├── users.ts
    ├── courses.ts
    ├── sections.ts
    ├── assignments.ts
    ├── submissions.ts
    ├── grades.ts
    ├── discussions.ts
    └── events.ts
tests/
├── setup.ts
├── client.test.ts
├── oauth-signature.test.ts
├── pagination.test.ts
└── resources/
    ├── users.test.ts
    ├── courses.test.ts
    ├── sections.test.ts
    ├── assignments.test.ts
    ├── submissions.test.ts
    ├── grades.test.ts
    ├── discussions.test.ts
    └── events.test.ts
```

---

## Tasks

### Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.build.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "schoology-ts",
  "version": "0.1.0",
  "description": "TypeScript client for Schoology API",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc && tsc -p tsconfig.build.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "tsc --noEmit"
  },
  "keywords": ["schoology", "api", "typescript"],
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^20.0.0",
    "nock": "^13.5.0",
    "typescript": "^5.4.0",
    "vitest": "^1.4.0"
  },
  "dependencies": {}
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create tsconfig.build.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "emitDeclarationOnly": true
  },
  "exclude": ["tests/**/*", "**/*.test.ts"]
}
```

- [ ] **Step 4: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
.env
*.log
coverage/
```

- [ ] **Step 6: Create README.md**

```md
# schoology-ts

TypeScript client for Schoology API with full type safety, OAuth 1.0a authentication, and automatic pagination.

## Install

\`\`\`bash
npm install schoology-ts
\`\`\`

## Usage

\`\`\`ts
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
\`\`\`
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json tsconfig.build.json vitest.config.ts .gitignore README.md
git commit -m "feat: project setup with TypeScript strict mode and vitest"
```

---

### Task 2: Error Types

**Files:**
- Create: `src/errors.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/errors.test.ts
import { describe, it, expect } from 'vitest';
import { SchoologyApiError, SchoologyAuthError } from '../src/errors';

describe('SchoologyApiError', () => {
  it('should create error with status and message', () => {
    const error = new SchoologyApiError(400, 'Bad Request', 'INVALID_PARAM');
    expect(error.status).toBe(400);
    expect(error.message).toBe('Bad Request');
    expect(error.code).toBe('INVALID_PARAM');
    expect(error instanceof Error).toBe(true);
  });
});

describe('SchoologyAuthError', () => {
  it('should create error for auth failures', () => {
    const error = new SchoologyAuthError('Invalid API key');
    expect(error.message).toBe('Invalid API key');
    expect(error instanceof SchoologyApiError).toBe(true);
    expect(error.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — errors module does not exist

- [ ] **Step 3: Write minimal implementation**

```ts
// src/errors.ts

export class SchoologyApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'SchoologyApiError';
  }
}

export class SchoologyAuthError extends SchoologyApiError {
  constructor(message: string) {
    super(401, message, 'AUTH_ERROR');
    this.name = 'SchoologyAuthError';
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/errors.ts tests/errors.test.ts
git commit -m "feat: add SchoologyApiError and SchoologyAuthError types"
```

---

### Task 3: Type Definitions

**Files:**
- Create: `src/types/index.ts`
- Create: `src/types/user.ts`
- Create: `src/types/course.ts`
- Create: `src/types/section.ts`
- Create: `src/types/assignment.ts`
- Create: `src/types/submission.ts`
- Create: `src/types/grade.ts`
- Create: `src/types/discussion.ts`
- Create: `src/types/event.ts`

- [ ] **Step 1: Create base response types**

```ts
// src/types/index.ts

export interface SchoologyListResponse<T> {
  data: T[];
  links: {
    next?: string;
    prev?: string;
  };
  total?: number;
}

export interface SchoologyLinks {
  next?: string;
  prev?: string;
}
```

- [ ] **Step 2: Create user types**

```ts
// src/types/user.ts

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent' | 'observer';

export interface User {
  uid: number;
  display_name: string;
  short_display_name: string;
  email: string;
  primary_email?: string;
  school_id?: number;
  role: UserRole;
  created?: number;
  updated?: number;
}

export interface ListUsersParams {
  section_id?: number | string;
  course_id?: number | string;
  limit?: number;
  offset?: number;
}
```

- [ ] **Step 3: Create course types**

```ts
// src/types/course.ts

export interface Course {
  id: number;
  title: string;
  description?: string;
  code?: string;
  section_ids?: number[];
  admin_ids?: number[];
  created?: number;
  updated?: number;
}

export interface ListCoursesParams {
  department_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  code?: string;
  section_ids?: number[];
  admin_ids?: number[];
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  code?: string;
}
```

- [ ] **Step 4: Create section types**

```ts
// src/types/section.ts

export interface Section {
  id: number;
  course_id: number;
  name: string;
  code?: string;
  access_code?: string;
  created?: number;
  updated?: number;
}

export interface ListSectionsParams {
  course_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateSectionInput {
  course_id: number | string;
  name: string;
  code?: string;
  access_code?: string;
}

export interface UpdateSectionInput {
  name?: string;
  code?: string;
}
```

- [ ] **Step 5: Create assignment types**

```ts
// src/types/assignment.ts

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  points?: number;
  due_date?: number;
  due_date_abs?: number;
  created?: number;
  updated?: number;
}

export interface ListAssignmentsParams {
  course_id?: number | string;
  section_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  points?: number;
  due_date?: number;
  due_date_abs?: number;
}

export interface UpdateAssignmentInput {
  title?: string;
  description?: string;
  points?: number;
  due_date?: number;
  due_date_abs?: number;
}
```

- [ ] **Step 6: Create submission types**

```ts
// src/types/submission.ts

export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  submitted?: number;
  submitted_date?: number;
  status?: 'draft' | 'submitted' | 'graded';
  grade_id?: number;
  created?: number;
  updated?: number;
}

export interface ListSubmissionsParams {
  assignment_id?: number | string;
  course_id?: number | string;
  user_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateSubmissionInput {
  assignment_id: number | string;
  user_id?: number | string;
  submitted_date?: number;
}

export interface UpdateSubmissionInput {
  submitted_date?: number;
}
```

- [ ] **Step 7: Create grade types**

```ts
// src/types/grade.ts

export interface Grade {
  id: number;
  assignment_id: number;
  user_id: number;
  points?: number;
  percentage?: number;
  letter_grade?: string;
  comment?: string;
  created?: number;
  updated?: number;
}

export interface ListGradesParams {
  assignment_id?: number | string;
  course_id?: number | string;
  section_id?: number | string;
  user_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateGradeInput {
  assignment_id: number | string;
  user_id: number | string;
  points?: number;
  letter_grade?: string;
  comment?: string;
}

export interface UpdateGradeInput {
  points?: number;
  letter_grade?: string;
  comment?: string;
}
```

- [ ] **Step 8: Create discussion types**

```ts
// src/types/discussion.ts

export interface Discussion {
  id: number;
  section_id: number;
  title: string;
  body?: string;
  author_id?: number;
  created?: number;
  updated?: number;
}

export interface ListDiscussionsParams {
  section_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateDiscussionInput {
  title: string;
  body?: string;
}

export interface UpdateDiscussionInput {
  title?: string;
  body?: string;
}
```

- [ ] **Step 9: Create event types**

```ts
// src/types/event.ts

export interface Event {
  id: number;
  title: string;
  description?: string;
  all_day?: boolean;
  start_date?: number;
  end_date?: number;
  course_id?: number;
  section_id?: number;
  created?: number;
  updated?: number;
}

export interface ListEventsParams {
  course_id?: number | string;
  section_id?: number | string;
  user_id?: number | string;
  limit?: number;
  offset?: number;
}
```

- [ ] **Step 10: Re-export all types from index.ts**

```ts
// src/types/index.ts

export type { SchoologyListResponse, SchoologyLinks } from './index';
export type { User, UserRole, ListUsersParams } from './user';
export type { Course, ListCoursesParams, CreateCourseInput, UpdateCourseInput } from './course';
export type { Section, ListSectionsParams, CreateSectionInput, UpdateSectionInput } from './section';
export type { Assignment, ListAssignmentsParams, CreateAssignmentInput, UpdateAssignmentInput } from './assignment';
export type { Submission, ListSubmissionsParams, CreateSubmissionInput, UpdateSubmissionInput } from './submission';
export type { Grade, ListGradesParams, CreateGradeInput, UpdateGradeInput } from './grade';
export type { Discussion, ListDiscussionsParams, CreateDiscussionInput, UpdateDiscussionInput } from './discussion';
export type { Event, ListEventsParams } from './event';
```

- [ ] **Step 11: Commit**

```bash
git add src/types/
git commit -m "feat: add all TypeScript type definitions for Schoology API"
```

---

### Task 4: Pagination

**Files:**
- Create: `src/pagination.ts`
- Create: `tests/pagination.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/pagination.test.ts
import { describe, it, expect, vi } from 'vitest';
import { buildPaginatedIterator, parseCursorParams } from '../src/pagination';

describe('parseCursorParams', () => {
  it('should parse cursor from URL', () => {
    const url = 'https://api.schoology.com/v1/users?limit=100&offset=100';
    const params = parseCursorParams(url);
    expect(params).toEqual({ limit: 100, offset: 100 });
  });

  it('should return empty object for URL without params', () => {
    const url = 'https://api.schoology.com/v1/users';
    const params = parseCursorParams(url);
    expect(params).toEqual({});
  });
});

describe('buildPaginatedIterator', () => {
  it('should iterate over paginated results', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ data: [{ id: 1 }], links: { next: 'http://example.com?offset=1' } })
      .mockResolvedValueOnce({ data: [{ id: 2 }], links: {} });

    const iterator = buildPaginatedIterator(fetcher, {});
    const results = [];

    for await (const item of iterator) {
      results.push(item);
    }

    expect(results).toEqual([{ id: 1 }, { id: 2 }]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — pagination module does not exist

- [ ] **Step 3: Write minimal implementation**

```ts
// src/pagination.ts

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedFetcher<T> {
  (params: PaginationParams & Record<string, unknown>): Promise<{
    data: T[];
    links: { next?: string; prev?: string };
  }>;
}

export function parseCursorParams(url: string): PaginationParams {
  if (!url) return {};
  try {
    const parsed = new URL(url);
    const params: PaginationParams = {};
    const limit = parsed.searchParams.get('limit');
    const offset = parsed.searchParams.get('offset');
    if (limit) params.limit = parseInt(limit, 10);
    if (offset) params.offset = parseInt(offset, 10);
    return params;
  } catch {
    return {};
  }
}

export async function* buildPaginatedIterator<T>(
  fetcher: PaginatedFetcher<T>,
  initialParams: Record<string, unknown>
): AsyncGenerator<T, void, undefined> {
  let currentParams = { ...initialParams };
  let hasMore = true;

  while (hasMore) {
    const result = await fetcher(currentParams as PaginationParams);
    for (const item of result.data) {
      yield item;
    }
    if (result.links.next) {
      currentParams = parseCursorParams(result.links.next);
    } else {
      hasMore = false;
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pagination.ts tests/pagination.test.ts
git commit -m "feat: add pagination helpers for cursor-based iteration"
```

---

### Task 5: OAuth Signature

**Files:**
- Create: `src/oauth.ts` (internal)
- Create: `tests/oauth-signature.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/oauth-signature.test.ts
import { describe, it, expect } from 'vitest';
import { createOAuthSignature } from '../src/oauth';

describe('createOAuthSignature', () => {
  it('should create consistent signature for same inputs', () => {
    const signature1 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'abc' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    const signature2 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'abc' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    expect(signature1).toBe(signature2);
  });

  it('should create different signature for different inputs', () => {
    const sig1 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'abc' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    const sig2 = createOAuthSignature({
      method: 'GET',
      url: 'https://api.schoology.com/v1/users',
      params: { oauth_consumer_key: 'key1', oauth_timestamp: '1234567890', oauth_nonce: 'xyz' },
      consumerSecret: 'secret1',
      tokenSecret: '',
    });
    expect(sig1).not.toBe(sig2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — oauth module does not exist

- [ ] **Step 3: Write minimal implementation**

```ts
// src/oauth.ts
import { createHmac } from 'crypto';

export interface SignatureParams {
  method: string;
  url: string;
  params: Record<string, string>;
  consumerSecret: string;
  tokenSecret: string;
}

export function createOAuthSignature(params: SignatureParams): string {
  const { method, url, params: oauthParams, consumerSecret, tokenSecret } = params;

  // Sort and encode parameters
  const sortedParams = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
    .join('&');

  // Create signature base string
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&');

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  // HMAC-SHA1
  const signature = createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64');

  return signature;
}

export function generateOAuthHeader(
  method: string,
  url: string,
  apiKey: string,
  apiSecret: string,
  additionalParams: Record<string, string> = {}
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    ...additionalParams,
  };

  const signature = createOAuthSignature({
    method,
    url,
    params: oauthParams,
    consumerSecret: apiSecret,
    tokenSecret: '',
  });

  oauthParams.oauth_signature = signature;

  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');

  return authHeader;
}

function generateNonce(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/oauth.ts tests/oauth-signature.test.ts
git commit -m "feat: add OAuth 1.0a HMAC-SHA1 signature generation"
```

---

### Task 6: Resource Methods (Users)

**Files:**
- Create: `src/resources/users.ts`
- Create: `tests/resources/users.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/resources/users.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import nock from 'nock';
import { SchoologyClient } from '../../src/client';

describe('SchoologyClient.users', () => {
  let client: SchoologyClient;

  beforeEach(() => {
    client = new SchoologyClient({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
    });
    nock.disableNetConnect();
  });

  it('should list users', async () => {
    nock('https://api.schoology.com/v1')
      .get('/users')
      .reply(200, { data: [{ uid: 1, display_name: 'Test User', short_display_name: 'Test', email: 'test@example.com', role: 'student' }], links: {} });

    const result = await client.users.list();
    expect(result.data[0].uid).toBe(1);
    expect(result.data[0].display_name).toBe('Test User');
  });

  it('should get user by id', async () => {
    nock('https://api.schoology.com/v1')
      .get('/users/123')
      .reply(200, { uid: 123, display_name: 'Test User', short_display_name: 'Test', email: 'test@example.com', role: 'teacher' });

    const result = await client.users.get(123);
    expect(result.uid).toBe(123);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — client and resources do not exist

- [ ] **Step 3: Write users resource**

```ts
// src/resources/users.ts
import type { User, ListUsersParams } from '../types/user.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class UsersResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListUsersParams): Promise<SchoologyListResponse<User>> {
    return this.client.request<User[]>({
      method: 'GET',
      path: '/users',
      params,
    });
  }

  async get(uid: number | string): Promise<User> {
    return this.client.request<User>({
      method: 'GET',
      path: `/users/${uid}`,
    });
  }

  async *listAll(params?: ListUsersParams): AsyncGenerator<User, void, undefined> {
    yield* this.client.listAll<User>('/users', params);
  }
}
```

- [ ] **Step 4: Commit partial**

```bash
git add src/resources/users.ts
git commit -m "feat: add users resource with list and get methods"
```

---

### Task 7: Main Client Class

**Files:**
- Create: `src/client.ts`
- Create: `tests/client.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/client.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import nock from 'nock';
import { SchoologyClient } from '../src/client';

describe('SchoologyClient', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  it('should create client with config', () => {
    const client = new SchoologyClient({
      apiKey: 'my-key',
      apiSecret: 'my-secret',
    });
    expect(client).toBeDefined();
  });

  it('should make authenticated request', async () => {
    nock('https://api.schoology.com/v1', {
      reqheaders: { Authorization: /OAuth/ },
    })
      .get('/users')
      .reply(200, { data: [], links: {} });

    const client = new SchoologyClient({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
    });
    const result = await client.request({ method: 'GET', path: '/users' });
    expect(result).toEqual({ data: [], links: {} });
  });

  it('should throw SchoologyAuthError on 401', async () => {
    nock('https://api.schoology.com/v1')
      .get('/users')
      .reply(401, { error: 'Invalid API key' });

    const client = new SchoologyClient({
      apiKey: 'bad-key',
      apiSecret: 'bad-secret',
    });

    await expect(client.request({ method: 'GET', path: '/users' }))
      .rejects.toThrow('Invalid API key');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — client module does not exist

- [ ] **Step 3: Write client interface and implementation**

```ts
// src/client.ts
import { SchoologyApiError, SchoologyAuthError } from './errors.js';
import { buildPaginatedIterator, PaginationParams } from './pagination.js';
import { generateOAuthHeader } from './oauth.js';

export interface SchoologyClientConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
  maxRetries?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  params?: Record<string, unknown>;
  body?: unknown;
}

export interface SchoologyClientInterface {
  request<T>(options: RequestOptions): Promise<T>;
  listAll<T>(path: string, params?: Record<string, unknown>): AsyncGenerator<T, void, undefined>;
}

export class SchoologyClient implements SchoologyClientInterface {
  private readonly baseUrl: string;
  private readonly maxRetries: number;

  constructor(config: SchoologyClientConfig) {
    this.baseUrl = config.baseUrl ?? 'https://api.schoology.com/v1';
    this.maxRetries = config.maxRetries ?? 3;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, params, body } = options;
    const url = `${this.baseUrl}${path}`;
    const searchParams = this.buildSearchParams(params);

    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.doRequest(method, url, searchParams, body);
        return response as T;
      } catch (error) {
        if (error instanceof SchoologyApiError && error.status === 429 && attempt < this.maxRetries) {
          // Exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  private async doRequest(
    method: string,
    url: string,
    searchParams: URLSearchParams,
    body: unknown
  ): Promise<unknown> {
    const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

    const authHeader = generateOAuthHeader(method, fullUrl, this.apiKey, this.apiSecret);

    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      throw new SchoologyAuthError('Invalid API key or secret');
    }

    if (response.status >= 400) {
      const errorBody = await response.json().catch(() => ({}));
      throw new SchoologyApiError(
        response.status,
        (errorBody as { message?: string }).message ?? response.statusText,
        (errorBody as { code?: string }).code
      );
    }

    return response.json();
  }

  private buildSearchParams(params?: Record<string, unknown>): URLSearchParams {
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
    }
    return searchParams;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async *listAll<T>(path: string, initialParams?: Record<string, unknown>): AsyncGenerator<T, void, undefined> {
    const fetcher = async (params: PaginationParams): Promise<{ data: T[]; links: { next?: string; prev?: string } }> => {
      return this.request({ method: 'GET', path, params: { ...initialParams, ...params } });
    };
    yield* buildPaginatedIterator(fetcher, initialParams ?? {});
  }

  private apiKey: string;
  private apiSecret: string;
}
```

- [ ] **Step 4: Update users.ts to use correct interface**

```ts
// src/resources/users.ts — update imports
import type { User, ListUsersParams } from '../types/user.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/client.ts tests/client.test.ts
git commit -m "feat: add main SchoologyClient class with auth and request handling"
```

---

### Task 8: All Remaining Resources

**Files:**
- Create: `src/resources/courses.ts`
- Create: `src/resources/sections.ts`
- Create: `src/resources/assignments.ts`
- Create: `src/resources/submissions.ts`
- Create: `src/resources/grades.ts`
- Create: `src/resources/discussions.ts`
- Create: `src/resources/events.ts`
- Create: `src/resources/index.ts`

- [ ] **Step 1: Create courses resource**

```ts
// src/resources/courses.ts
import type { Course, ListCoursesParams, CreateCourseInput, UpdateCourseInput } from '../types/course.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class CoursesResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListCoursesParams): Promise<SchoologyListResponse<Course>> {
    return this.client.request<Course[]>({ method: 'GET', path: '/courses', params }) as Promise<SchoologyListResponse<Course>>;
  }

  async get(cid: number | string): Promise<Course> {
    return this.client.request<Course>({ method: 'GET', path: `/courses/${cid}` });
  }

  async create(data: CreateCourseInput): Promise<Course> {
    return this.client.request<Course>({ method: 'POST', path: '/courses', body: data });
  }

  async update(cid: number | string, data: UpdateCourseInput): Promise<Course> {
    return this.client.request<Course>({ method: 'PUT', path: `/courses/${cid}`, body: data });
  }

  async delete(cid: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/courses/${cid}` });
  }

  async *listAll(params?: ListCoursesParams): AsyncGenerator<Course, void, undefined> {
    yield* this.client.listAll<Course>('/courses', params);
  }
}
```

- [ ] **Step 2: Create sections resource**

```ts
// src/resources/sections.ts
import type { Section, ListSectionsParams, CreateSectionInput, UpdateSectionInput } from '../types/section.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class SectionsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListSectionsParams): Promise<SchoologyListResponse<Section>> {
    return this.client.request<Section[]>({ method: 'GET', path: '/sections', params }) as Promise<SchoologyListResponse<Section>>;
  }

  async get(sid: number | string): Promise<Section> {
    return this.client.request<Section>({ method: 'GET', path: `/sections/${sid}` });
  }

  async create(data: CreateSectionInput): Promise<Section> {
    return this.client.request<Section>({ method: 'POST', path: '/sections', body: data });
  }

  async update(sid: number | string, data: UpdateSectionInput): Promise<Section> {
    return this.client.request<Section>({ method: 'PUT', path: `/sections/${sid}`, body: data });
  }

  async delete(sid: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/sections/${sid}` });
  }

  async *listAll(params?: ListSectionsParams): AsyncGenerator<Section, void, undefined> {
    yield* this.client.listAll<Section>('/sections', params);
  }
}
```

- [ ] **Step 3: Create assignments resource**

```ts
// src/resources/assignments.ts
import type { Assignment, ListAssignmentsParams, CreateAssignmentInput, UpdateAssignmentInput } from '../types/assignment.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class AssignmentsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListAssignmentsParams): Promise<SchoologyListResponse<Assignment>> {
    return this.client.request<Assignment[]>({ method: 'GET', path: '/assignments', params }) as Promise<SchoologyListResponse<Assignment>>;
  }

  async get(aid: number | string): Promise<Assignment> {
    return this.client.request<Assignment>({ method: 'GET', path: `/assignments/${aid}` });
  }

  async create(courseId: number | string, data: CreateAssignmentInput): Promise<Assignment> {
    return this.client.request<Assignment>({ method: 'POST', path: `/courses/${courseId}/assignments`, body: data });
  }

  async update(aid: number | string, data: UpdateAssignmentInput): Promise<Assignment> {
    return this.client.request<Assignment>({ method: 'PUT', path: `/assignments/${aid}`, body: data });
  }

  async delete(aid: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/assignments/${aid}` });
  }

  async *listAll(params?: ListAssignmentsParams): AsyncGenerator<Assignment, void, undefined> {
    yield* this.client.listAll<Assignment>('/assignments', params);
  }
}
```

- [ ] **Step 4: Create submissions resource**

```ts
// src/resources/submissions.ts
import type { Submission, ListSubmissionsParams, CreateSubmissionInput, UpdateSubmissionInput } from '../types/submission.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class SubmissionsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListSubmissionsParams): Promise<SchoologyListResponse<Submission>> {
    return this.client.request<Submission[]>({ method: 'GET', path: '/submissions', params }) as Promise<SchoologyListResponse<Submission>>;
  }

  async get(sid: number | string): Promise<Submission> {
    return this.client.request<Submission>({ method: 'GET', path: `/submissions/${sid}` });
  }

  async create(aid: number | string, data: CreateSubmissionInput): Promise<Submission> {
    return this.client.request<Submission>({ method: 'POST', path: `/assignments/${aid}/submissions`, body: data });
  }

  async update(sid: number | string, data: UpdateSubmissionInput): Promise<Submission> {
    return this.client.request<Submission>({ method: 'PUT', path: `/submissions/${sid}`, body: data });
  }

  async *listAll(params?: ListSubmissionsParams): AsyncGenerator<Submission, void, undefined> {
    yield* this.client.listAll<Submission>('/submissions', params);
  }
}
```

- [ ] **Step 5: Create grades resource**

```ts
// src/resources/grades.ts
import type { Grade, ListGradesParams, CreateGradeInput, UpdateGradeInput } from '../types/grade.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class GradesResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListGradesParams): Promise<SchoologyListResponse<Grade>> {
    return this.client.request<Grade[]>({ method: 'GET', path: '/grades', params }) as Promise<SchoologyListResponse<Grade>>;
  }

  async get(gid: number | string): Promise<Grade> {
    return this.client.request<Grade>({ method: 'GET', path: `/grades/${gid}` });
  }

  async create(data: CreateGradeInput): Promise<Grade> {
    return this.client.request<Grade>({ method: 'POST', path: '/grades', body: data });
  }

  async update(gid: number | string, data: UpdateGradeInput): Promise<Grade> {
    return this.client.request<Grade>({ method: 'PUT', path: `/grades/${gid}`, body: data });
  }

  async *listAll(params?: ListGradesParams): AsyncGenerator<Grade, void, undefined> {
    yield* this.client.listAll<Grade>('/grades', params);
  }
}
```

- [ ] **Step 6: Create discussions resource**

```ts
// src/resources/discussions.ts
import type { Discussion, ListDiscussionsParams, CreateDiscussionInput, UpdateDiscussionInput } from '../types/discussion.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class DiscussionsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListDiscussionsParams): Promise<SchoologyListResponse<Discussion>> {
    return this.client.request<Discussion[]>({ method: 'GET', path: '/discussions', params }) as Promise<SchoologyListResponse<Discussion>>;
  }

  async get(did: number | string): Promise<Discussion> {
    return this.client.request<Discussion>({ method: 'GET', path: `/discussions/${did}` });
  }

  async create(sectionId: number | string, data: CreateDiscussionInput): Promise<Discussion> {
    return this.client.request<Discussion>({ method: 'POST', path: `/sections/${sectionId}/discussions`, body: data });
  }

  async update(did: number | string, data: UpdateDiscussionInput): Promise<Discussion> {
    return this.client.request<Discussion>({ method: 'PUT', path: `/discussions/${did}`, body: data });
  }

  async delete(did: number | string): Promise<void> {
    await this.client.request({ method: 'DELETE', path: `/discussions/${did}` });
  }

  async *listAll(params?: ListDiscussionsParams): AsyncGenerator<Discussion, void, undefined> {
    yield* this.client.listAll<Discussion>('/discussions', params);
  }
}
```

- [ ] **Step 7: Create events resource**

```ts
// src/resources/events.ts
import type { Event, ListEventsParams } from '../types/event.js';
import type { SchoologyListResponse } from '../types/index.js';
import type { SchoologyClientInterface } from '../client.js';

export class EventsResource {
  constructor(private client: SchoologyClientInterface) {}

  async list(params?: ListEventsParams): Promise<SchoologyListResponse<Event>> {
    return this.client.request<Event[]>({ method: 'GET', path: '/events', params }) as Promise<SchoologyListResponse<Event>>;
  }

  async get(eid: number | string): Promise<Event> {
    return this.client.request<Event>({ method: 'GET', path: `/events/${eid}` });
  }

  async *listAll(params?: ListEventsParams): AsyncGenerator<Event, void, undefined> {
    yield* this.client.listAll<Event>('/events', params);
  }
}
```

- [ ] **Step 8: Create resources index**

```ts
// src/resources/index.ts
export { UsersResource } from './users.js';
export { CoursesResource } from './courses.js';
export { SectionsResource } from './sections.js';
export { AssignmentsResource } from './assignments.js';
export { SubmissionsResource } from './submissions.js';
export { GradesResource } from './grades.js';
export { DiscussionsResource } from './discussions.js';
export { EventsResource } from './events.js';
```

- [ ] **Step 9: Update client.ts to instantiate all resources**

Add to client constructor:
```ts
this.users = new UsersResource(this);
this.courses = new CoursesResource(this);
this.sections = new SectionsResource(this);
this.assignments = new AssignmentsResource(this);
this.submissions = new SubmissionsResource(this);
this.grades = new GradesResource(this);
this.discussions = new DiscussionsResource(this);
this.events = new EventsResource(this);
```

Add resource properties to class:
```ts
users: UsersResource;
courses: CoursesResource;
sections: SectionsResource;
assignments: AssignmentsResource;
submissions: SubmissionsResource;
grades: GradesResource;
discussions: DiscussionsResource;
events: EventsResource;
```

- [ ] **Step 10: Create public exports**

```ts
// src/index.ts
export { SchoologyClient } from './client.js';
export type { SchoologyClientConfig, RequestOptions } from './client.js';
export { SchoologyApiError, SchoologyAuthError } from './errors.js';
export type { SchoologyListResponse, SchoologyLinks } from './types/index.js';
export type { User } from './types/user.js';
export type { Course } from './types/course.js';
export type { Section } from './types/section.js';
export type { Assignment } from './types/assignment.js';
export type { Submission } from './types/submission.js';
export type { Grade } from './types/grade.js';
export type { Discussion } from './types/discussion.js';
export type { Event } from './types/event.js';
```

- [ ] **Step 11: Run tests to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 12: Run build to verify it compiles**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 13: Commit**

```bash
git add src/resources/ src/index.ts
git commit -m "feat: add all API resources (courses, sections, assignments, submissions, grades, discussions, events)"
```

---

### Task 9: Final Integration Tests

**Files:**
- Create: `tests/resources/courses.test.ts`
- Create: `tests/integration.test.ts`

- [ ] **Step 1: Write integration test for courses**

```ts
// tests/resources/courses.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import { SchoologyClient } from '../../src/client';

describe('SchoologyClient.courses', () => {
  let client: SchoologyClient;

  beforeEach(() => {
    client = new SchoologyClient({ apiKey: 'test', apiSecret: 'test' });
    nock.disableNetConnect();
  });

  it('should list courses', async () => {
    nock('https://api.schoology.com/v1')
      .get('/courses')
      .reply(200, { data: [{ id: 1, title: 'Math 101' }], links: {} });

    const result = await client.courses.list();
    expect(result.data[0].title).toBe('Math 101');
  });

  it('should create course', async () => {
    nock('https://api.schoology.com/v1')
      .post('/courses')
      .reply(201, { id: 1, title: 'New Course' });

    const result = await client.courses.create({ title: 'New Course' });
    expect(result.title).toBe('New Course');
  });
});
```

- [ ] **Step 2: Write integration test for auto-pagination**

```ts
// tests/integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import { SchoologyClient } from '../src/client';

describe('Auto-pagination', () => {
  let client: SchoologyClient;

  beforeEach(() => {
    client = new SchoologyClient({ apiKey: 'test', apiSecret: 'test' });
    nock.disableNetConnect();
  });

  it('should iterate over all pages', async () => {
    nock('https://api.schoology.com/v1')
      .get('/users')
      .reply(200, { data: [{ uid: 1 }], links: { next: 'https://api.schoology.com/v1/users?offset=1' } })
      .get('/users')
      .query({ offset: '1' })
      .reply(200, { data: [{ uid: 2 }], links: {} });

    const users: number[] = [];
    for await (const user of client.users.listAll()) {
      users.push(user.uid);
    }
    expect(users).toEqual([1, 2]);
  });
});
```

- [ ] **Step 3: Run tests to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add tests/resources/courses.test.ts tests/integration.test.ts
git commit -m "test: add integration tests for courses and pagination"
```

---

## Self-Review Checklist

- [ ] All types from spec are implemented
- [ ] All 8 resources (users, courses, sections, assignments, submissions, grades, discussions, events) have list, get, create, update, delete where applicable
- [ ] `listAll()` async iterator works
- [ ] OAuth 1.0a signature is implemented
- [ ] Error handling: SchoologyApiError, SchoologyAuthError
- [ ] Rate limit retry with exponential backoff
- [ ] TypeScript strict mode — no `any`
- [ ] All tests pass
- [ ] Build succeeds

---

## Plan Complete

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
