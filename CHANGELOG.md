# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-28

### ✨ New Features

- **Complete API Coverage**: Full TypeScript client for Schoology API with 8 resource types:
  - Users — list, get, listAll (auto-pagination)
  - Courses — list, get, create, update, delete, listAll
  - Sections — list, get, create, update, delete, listAll
  - Assignments — list, get, create, update, delete, listAll
  - Submissions — list, get, create, update, listAll
  - Grades — list, get, create, update, listAll
  - Discussions — list, get, create, update, delete, listAll
  - Events — list, get, listAll

- **OAuth 1.0a Authentication**: Secure HMAC-SHA1 signature for all API requests

- **Automatic Pagination**: Async iterator (`listAll()`) for seamless iteration over large datasets without managing cursors

- **Rate Limit Handling**: Automatic retry with exponential backoff on 429 responses

### 🔧 Technical Details

- 100% TypeScript with strict mode enabled
- 18 unit and integration tests (all passing)
- Native Node.js `fetch` — no external HTTP dependencies
- Resource-based architecture for clean separation of concerns
