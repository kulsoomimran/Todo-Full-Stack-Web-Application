<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version: 1.0.0 (Initial release)
  Date: 2026-01-09

  NEW CONSTITUTION - First adoption for Hackathon Phase-2

  Core Principles Added (6):
  1. Spec-Driven Development (SDD)
  2. Agentic Workflow Compliance
  3. Security-First Design
  4. Deterministic Behavior
  5. Full-Stack Coherence
  6. Technology Stack Non-Negotiability

  Key Sections Added:
  - Technology Stack (fixed, non-negotiable)
  - Mandatory Workflow (SDD → Plan → Tasks → Implementation)
  - Security & Authentication Requirements
  - API & REST Standards
  - Error Handling & Documentation

  Dependent Templates Requiring Review:
  - ✅ spec-template.md (aligns with requirement clarity mandate)
  - ✅ plan-template.md (Constitution Check aligns with principles)
  - ✅ tasks-template.md (independent testability enforced)
  - ✅ phr-template.prompt.md (PHR recording required)
  - ⚠ README.md (runtime guidance - may need agent-specific notes)

  No deferred TODOs; all values concrete.
  ============================================================================
-->

# Todo Full-Stack Web Application (Hackathon Phase-2) Constitution

## Core Principles

### I. Spec-Driven Development (SDD)
All implementation must strictly follow approved specifications. No code is written without:
- An explicit, written feature specification (spec.md)
- An approved implementation plan (plan.md)
- A complete task breakdown (tasks.md)

Every change MUST be traceable to a spec requirement. Ad-hoc coding is prohibited.

**Rationale**: Spec-first ensures alignment between business intent, technical design, and implementation. Prevents scope creep and rework.

### II. Agentic Workflow Compliance
Development execution follows the Agentic Dev Stack workflow exclusively:
- Specification → Planning → Task Breakdown → Implementation via specialized agents
- No manual coding; all code generated through Claude agents (frontend-builder, fastapi-backend-developer, database-skill, auth-skill)
- Agents operate on approved specs and plans; humans validate at checkpoints

**Rationale**: Agentic execution ensures consistency, reproducibility, and deterministic code quality. Specialized agents enforce best practices for each layer.

### III. Security-First Design
Authentication, authorization, and user isolation are enforced by default in every component:
- All user data is scoped by authenticated user_id
- Every API endpoint requires valid JWT token after signup/signin
- Passwords are never stored in logs or API responses
- Secrets stored in .env only; never hardcoded
- SQL injection, XSS, and CSRF protections enforced by framework/ORM

**Rationale**: Security as a system property prevents breach. User scoping prevents data leakage across users.

### IV. Deterministic Behavior
All APIs and UI must behave consistently across users and sessions:
- Same input → same output (no race conditions, no order-dependent behavior)
- Error responses use consistent HTTP status codes (401 for auth, 403 for permission, 400 for validation, 500 for server errors)
- Errors are explicit and documented
- No silent failures; all failure paths logged and returned to client

**Rationale**: Predictable behavior enables reliable client code and easier debugging. Determinism is foundational to a multi-user system.

### V. Full-Stack Coherence
Frontend, backend, and database must integrate without mismatches:
- API contracts (endpoints, request/response schema) defined in backend spec
- Frontend implementation matches backend contract exactly
- Database schema migrations tracked and documented
- Deployment is atomic; all layers updated together

**Rationale**: Coherence prevents integration surprises. Contracts prevent frontend/backend drift.

### VI. Technology Stack Non-Negotiability
The following technology stack is fixed and mandatory. No substitutions or additions without explicit architecture decision:
- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)

All code must use these technologies exclusively.

**Rationale**: Fixed stack eliminates decision paralysis, enforces consistency, and aligns with Hackathon requirements.

## Mandatory Workflow

Development follows this invariant order. No skipping phases:

1. **Specification** (`/sp.specify`)
   - User story scenarios (prioritized by business value)
   - Functional + non-functional requirements (explicit, testable)
   - Key entities and their relationships
   - Success criteria (measurable outcomes)

2. **Planning** (`/sp.plan`)
   - Architecture and technology choices with rationale
   - Scope boundary (in/out)
   - API contracts (if backend feature)
   - Data model or schema (if data storage)
   - Non-functional requirements (performance, security, reliability)

3. **Task Breakdown** (`/sp.tasks`)
   - Independent, testable tasks for each user story
   - Dependency graph and execution order
   - Phase structure: Setup → Foundational → User Story 1 → User Story 2 → Polish
   - Each task assigns: file paths, acceptance criteria, test coverage

4. **Implementation** (`/sp.implement`)
   - Execute tasks via specialized agents
   - Each agent validates compliance with spec/plan
   - Tasks completed and tested in dependency order
   - Prompt History Records (PHRs) created for every major step

No implementation begins until all prior phases are approved.

## Security & Authentication Requirements

- **User Isolation**: Every query, API response, and UI element filtered by authenticated user_id
- **JWT Tokens**: Stateless, signed, verified on every protected endpoint
- **Password Hashing**: Delegated to Better Auth; never handled directly
- **Secrets Management**: All secrets (DB URL, JWT secret, API keys) in .env, never in code
- **CORS Policy**: Frontend domain registered in backend CORS config
- **Audit Trail**: Login events and sensitive operations logged with timestamps

## API & REST Standards

- **Endpoints**: RESTful, resource-based (`/api/todos`, `/api/auth/signin`)
- **Status Codes**:
  - 200 OK (success)
  - 201 Created (new resource)
  - 400 Bad Request (validation failure)
  - 401 Unauthorized (missing/invalid token)
  - 403 Forbidden (user lacks permission)
  - 404 Not Found
  - 500 Server Error (logged, returned with error ID)
- **Request/Response**: JSON, consistent schema, documented in contract
- **Token Delivery**: `Authorization: Bearer <JWT>` header
- **Error Format**: `{ "error": "message", "code": "error_code", "details": {...} }`

## Error Handling & Documentation

- **Explicit Error Paths**: Every API spec documents error scenarios (400, 401, 403, 404, 500)
- **Client Feedback**: Errors returned to frontend; frontend displays user-friendly messages
- **Logging**: All errors logged server-side with context (user_id, endpoint, timestamp, stack trace)
- **No Silent Failures**: Missing data, validation failures, permission denials all returned explicitly
- **API Documentation**: OpenAPI/Swagger spec generated from backend; frontend references it

## Code & Quality Standards

- **Type Safety**: TypeScript on frontend, type hints on backend (Pydantic models)
- **Testing**: Unit tests for business logic, integration tests for API contracts, E2E tests for user journeys
- **Code Review**: All changes reviewed against spec compliance and security requirements
- **Documentation**: READMEs, API docs, architecture decisions (ADRs) for significant choices
- **Performance**: API response time p95 < 200ms, frontend load time < 3s on 3G
- **Accessibility**: WCAG 2.1 AA on frontend; no hardcoded colors/sizes

## Governance

**Compliance Verification**:
- Every PR/commit must reference its spec and plan
- Code reviews verify: spec compliance, security enforcement, deterministic behavior, test coverage
- Architectural decisions (framework choices, API redesigns, schema changes) require Architectural Decision Records (ADRs)

**Amendment Procedure**:
- Constitution changes require explicit user consent
- Changes trigger version bump: MAJOR (backward-incompatible), MINOR (additions), PATCH (clarifications)
- Amended sections update dependent templates (spec, plan, tasks, command files)

**Prompt History Records**:
- Every user prompt recorded in `history/prompts/` (constitution, feature-name, or general subdirectory)
- PHR captures: input (verbatim), output (concise summary), stage, date, model, files modified, tests run
- PHRs enable traceability and learning; automatic garbage collection after 90 days

**Architectural Decision Records**:
- Significant decisions (long-term impact, alternatives considered, cross-cutting scope) documented as ADRs
- ADRs stored in `history/adr/`
- Suggested by `/sp.adr` command; never auto-created without user consent

**Version & Compliance Audit**:
- Constitution version shown in header (semantic versioning)
- Quarterly review: spec coverage, incident log review, principle effectiveness assessment
- Violations escalated; mitigation recorded

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
