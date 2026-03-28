# Schoology API Client — Getting Started Guide

## Table of Contents

1. [Installation](#installation)
2. [Authentication](#authentication)
3. [Client Configuration](#client-configuration)
4. [Basic Usage](#basic-usage)
5. [Pagination](#pagination)
6. [Error Handling](#error-handling)
7. [API Reference](#api-reference)
8. [Examples](#examples)

---

## Installation

```bash
npm install schoology-ts
```

Requires Node.js 18+ (uses native `fetch`).

---

## Authentication

Schoology uses OAuth 1.0a with API Key + Secret. Get your credentials from Schoology's API section.

```ts
import { SchoologyClient } from 'schoology-ts';

const client = new SchoologyClient({
  apiKey: process.env.SCHOOLOGY_API_KEY!,
  apiSecret: process.env.SCHOOLOGY_API_SECRET!,
});
```

**Environment variables** (recommended):

```bash
SCHOOLOGY_API_KEY=your_api_key
SCHOOLOGY_API_SECRET=your_api_secret
```

---

## Client Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **required** | Your Schoology API key |
| `apiSecret` | `string` | **required** | Your Schoology API secret |
| `baseUrl` | `string` | `https://api.schoology.com/v1` | API base URL |
| `maxRetries` | `number` | `3` | Max retry attempts on rate limit |

---

## Basic Usage

### List Resources

```ts
// List users in a section
const users = await client.users.list({ section_id: 123 });

// List courses
const courses = await client.courses.list({ department_id: 5 });

// Pagination response
console.log(users.data);     // Array of users
console.log(users.links);   // { next?, prev? }
console.log(users.total);    // Total count (if available)
```

### Get Single Resource

```ts
const user = await client.users.get(12345);
const course = await client.courses.get(67890);
```

### Create Resources

```ts
const course = await client.courses.create({
  title: 'Mathematics 101',
  description: 'Introduction to algebra',
  code: 'MATH-101',
});

const assignment = await client.assignments.create(course.id, {
  title: 'Homework 1',
  points: 100,
  due_date: Date.now() + 7 * 24 * 60 * 60 * 1000,
});
```

### Update Resources

```ts
const updated = await client.courses.update(123, {
  title: 'Advanced Mathematics',
});
```

### Delete Resources

```ts
await client.courses.delete(123);
```

---

## Pagination

### Manual Pagination

```ts
const page1 = await client.users.list({ section_id: 123, limit: 100 });
// page1.links.next = URL for next page

if (page1.links.next) {
  const page2 = await client.users.list({ 
    section_id: 123, 
    offset: 100 
  });
}
```

### Automatic Pagination (Recommended)

Iterate over all items without managing cursors:

```ts
// Fetches all users across all pages automatically
for await (const user of client.users.listAll({ section_id: 123 })) {
  console.log(user.display_name);
}
```

**Note:** `listAll()` internally fetches pages until `links.next` is exhausted.

---

## Error Handling

```ts
import { SchoologyClient, SchoologyApiError, SchoologyAuthError } from 'schoology-ts';

try {
  const user = await client.users.get(999999);
} catch (error) {
  if (error instanceof SchoologyAuthError) {
    // 401 — Invalid API key or secret
    console.error('Authentication failed:', error.message);
  } else if (error instanceof SchoologyApiError) {
    // API returned an error
    console.error(`API Error ${error.status}:`, error.message);
    if (error.code) console.error('Error code:', error.code);
  } else {
    // Network or other error
    throw error;
  }
}
```

### Rate Limit Handling

The client automatically retries on 429 responses with exponential backoff:

```ts
const client = new SchoologyClient({
  apiKey: process.env.SCHOOLOGY_API_KEY!,
  apiSecret: process.env.SCHOOLOGY_API_SECRET!,
  maxRetries: 5, // Customize retry attempts
});
```

---

## API Reference

### Users

```ts
client.users.list(params?)           // List users
client.users.get(uid)                // Get user by ID
client.users.listAll(params?)        // Iterate all users (auto-paginate)
```

### Courses

```ts
client.courses.list(params?)         // List courses
client.courses.get(cid)             // Get course by ID
client.courses.create(data)          // Create course
client.courses.update(cid, data)     // Update course
client.courses.delete(cid)           // Delete course
client.courses.listAll(params?)      // Iterate all courses
```

### Sections

```ts
client.sections.list(params?)         // List sections
client.sections.get(sid)             // Get section by ID
client.sections.create(data)         // Create section
client.sections.update(sid, data)    // Update section
client.sections.delete(sid)          // Delete section
client.sections.listAll(params?)     // Iterate all sections
```

### Assignments

```ts
client.assignments.list(params?)              // List assignments
client.assignments.get(aid)                   // Get assignment by ID
client.assignments.create(courseId, data)     // Create assignment in course
client.assignments.update(aid, data)          // Update assignment
client.assignments.delete(aid)                // Delete assignment
client.assignments.listAll(params?)           // Iterate all assignments
```

### Submissions

```ts
client.submissions.list(params?)              // List submissions
client.submissions.get(sid)                   // Get submission by ID
client.submissions.create(aid, data)          // Create submission
client.submissions.update(sid, data)          // Update submission
client.submissions.listAll(params?)            // Iterate all submissions
```

### Grades

```ts
client.grades.list(params?)            // List grades
client.grades.get(gid)                // Get grade by ID
client.grades.create(data)             // Create grade
client.grades.update(gid, data)        // Update grade
client.grades.listAll(params?)         // Iterate all grades
```

### Discussions

```ts
client.discussions.list(params?)           // List discussions
client.discussions.get(did)               // Get discussion by ID
client.discussions.create(sectionId, data) // Create discussion in section
client.discussions.update(did, data)       // Update discussion
client.discussions.delete(did)             // Delete discussion
client.discussions.listAll(params?)        // Iterate all discussions
```

### Events

```ts
client.events.list(params?)         // List events
client.events.get(eid)              // Get event by ID
client.events.listAll(params?)     // Iterate all events
```

---

## Examples

### Get All Students in a Section

```ts
const students = [];
for await (const user of client.users.listAll({ section_id: 123 })) {
  if (user.role === 'student') {
    students.push(user);
  }
}
console.log(`Found ${students.length} students`);
```

### Create an Assignment with Due Date

```ts
const dueDate = new Date('2026-04-15T23:59:59').getTime();

const assignment = await client.assignments.create(courseId, {
  title: 'Chapter 5 Quiz',
  description: 'Complete all questions from Chapter 5',
  points: 50,
  due_date: dueDate,
});
```

### Update Grades in Bulk

```ts
const grades = [
  { studentId: 1, points: 95 },
  { studentId: 2, points: 87 },
  { studentId: 3, points: 92 },
];

for (const { studentId, points } of grades) {
  await client.grades.create({
    assignment_id: assignmentId,
    user_id: studentId,
    points,
    comment: 'Great work!',
  });
}
```
