# Decisions

## Structure

I used an npm workspaces monorepo with three applications and one shared package:

- `apps/mobile` – Expo / React Native, the primary surface
- `apps/web` – React / Vite, the secondary surface
- `apps/mock-api` – Express API used by both clients
- `packages/shared-core` – types, API client, React Query queries and mutations

I kept the web and mobile presentation separate because the scenario describes an existing React web application alongside a React Native application. I wanted to model that boundary rather than assume the web application would move to React Native Web.

The behaviour that must not diverge lives in `shared-core`. Both surfaces use the same save/unsave mutations, optimistic updates, rollback and reconciliation logic.

Each app provides its API URL to the shared package rather than having platform configuration inside shared code.

## Trade-offs

### 1. Separate React and React Native UIs vs React Native Web

I considered Expo / React Native Web, which could reduce duplicated presentation code.

I chose separate UIs because it better represents the stated situation of an existing React web application and a new React Native app. The cost is some duplicated presentation and additional setup. React Native Web would reduce that duplication, but would couple both surfaces to one rendering model and assume a larger change to the existing web architecture.

### 2. JSON persistence vs a database

I considered SQLite for the mock API.

I chose JSON-backed persistence because the exercise is time-boxed and only models one signed-in user. It still behaves like persistent server state across restarts while leaving more time for the frontend behaviour I wanted to demonstrate.

The cost is limited concurrency, data integrity and scalability. I would not use file-backed persistence for a production service.

### 3. Shared React Query hooks vs framework-independent core

The shared package contains React Query hooks, so it is React-specific but platform-agnostic.

I considered separating the domain/API layer completely from React and adding React adapters for each client. Both required consumers are React-based, so that added abstraction did not provide enough value for this exercise.

The cost is that a future non-React client could not consume the hooks directly. In that case I would split framework-independent API/domain code from React-specific adapters.

## Testing

I prioritised the behaviour with the highest risk: save/unsave state, persistence, optimistic updates, failure rollback and API response handling.

The mock API supports controlled mutation failures so rollback can be exercised deliberately. I also tested API behaviour including successful save/delete, duplicate save and removing a missing item.

I did not prioritise snapshot or detailed visual tests because the UI is intentionally small and the exercise focuses more on shared behaviour than presentation. With more time I would add automated tests around the shared mutation behaviour, particularly optimistic updates, rollback and reconciliation.

## Not done / next

Before serving two million users per month I would replace JSON persistence with a production datastore and enforce uniqueness for saved articles per user.

I would add authentication, runtime API validation, observability, structured logging, metrics and error reporting.

I would also add automated integration tests, accessibility coverage, pagination for article feeds and saved items, retry/offline behaviour, and stronger handling of concurrent mutations. The current snapshot-based optimistic rollback can temporarily restore stale state if several mutations overlap; I would address that with targeted rollback/reconciliation.

## AI use

I used ChatGPT as a sounding board while working through architecture, React Query behaviour and implementation details, and to review code as I built it.

I did not treat its output as the solution. For example, I challenged whether Expo Web was a better choice than separate web/mobile apps and kept separate surfaces because that better matched the scenario. I also chose npm workspaces instead of an initially suggested additional monorepo tool, keeping reviewer setup to a single `npm install`.

AI suggested implementation patterns for optimistic updates, but I worked through, implemented and tested the behaviour incrementally so I could understand and defend it rather than copying a generated solution.
