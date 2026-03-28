# Examples

Practical scripts using `schoology-ts` for common tasks.

## Setup

Set your credentials as environment variables:

```bash
export SCHOOLOGY_API_KEY=your_api_key
export SCHOOLOGY_API_SECRET=your_api_secret
```

Or create a `.env` file:

```bash
SCHOOLOGY_API_KEY=your_api_key
SCHOOLOGY_API_SECRET=your_api_secret
```

## Examples

### List Students

List all students in a section:

```bash
SECTION_ID=123 npx tsx examples/list-students.ts
```

### Create Assignment

Create an assignment with a due date:

```bash
# Basic
COURSE_ID=456 npx tsx examples/create-assignment.ts

# Custom values
COURSE_ID=456 TITLE="Chapter 5 Quiz" POINTS=50 DUE_IN_DAYS=14 npx tsx examples/create-assignment.ts
```

### Bulk Grade

Grade multiple submissions at once:

```bash
# Format: "studentId:points,studentId:points,..."
ASSIGNMENT_ID=789 STUDENT_GRADES="1:95,2:87,3:92,4:78" npx tsx examples/bulk-grade.ts
```

### Export Grades

Export all grades for a course to CSV:

```bash
COURSE_ID=456 npx tsx examples/export-grades.ts > grades.csv
```

Or save directly to file:

```bash
COURSE_ID=456 npx tsx examples/export-grades.ts
```

## Requirements

- Node.js 18+
- Run `npm install` in the project root first
- Use `npx tsx` to run TypeScript files directly, or compile first with `npm run build`
