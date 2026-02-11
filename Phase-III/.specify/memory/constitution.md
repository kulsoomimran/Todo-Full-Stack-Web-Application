<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version: 1.1.0 (Phase-III Update - AI-Powered Todo Chatbot)
  Date: 2026-02-11

  CONSTITUTION AMENDMENT - Phase-III Update for AI-Powered Todo Chatbot

  Core Principles Modified (6 existing + 2 new):
  1. Spec-Driven Development (SDD) - Updated to include AI agent specs
  2. Agentic Workflow Compliance - Expanded to include OpenAI Agents SDK
  3. Security-First Design - Enhanced with AI-specific security
  4. Deterministic Behavior - Updated for stateless AI interactions
  5. Full-Stack Coherence - Extended to include AI agent layer
  6. Technology Stack Non-Negotiability - Updated with new AI/MCP stack
  7. AI Agent-First Architecture (NEW) - Agent-first design using OpenAI Agents SDK
  8. MCP Tool Compliance (NEW) - All actions via stateless, schema-defined MCP tools

  Key Sections Added:
  - AI Agent Architecture (stateless, tool-execution only)
  - MCP Tool Standards (schema-defined, stateless)
  - Conversation Context Management (rebuild from DB each request)
  - AI Action Traceability (persist all AI actions)

  Key Sections Updated:
  - Technology Stack (added OpenAI Agents SDK, MCP SDK, conversation persistence)
  - Mandatory Workflow (extended for AI agent integration)
  - Security & Authentication (enhanced for AI interactions)
  - API & REST Standards (added stateless chat endpoint)

  Dependent Templates Requiring Review:
  - ✅ spec-template.md (aligns with AI agent requirement clarity)
  - ✅ plan-template.md (Constitution Check aligns with AI principles)
  - ✅ tasks-template.md (updated for AI/MCP task categorization)
  - ✅ phr-template.prompt.md (PHR recording extended for AI actions)
  - ⚠ README.md (runtime guidance - needs AI agent notes)

  No deferred TODOs; all values concrete.
  ============================================================================
-->

# Todo Full-Stack Web Application (Hackathon Phase-III) Constitution - AI-Powered Todo Chatbot

## Core Principles

### I. Spec-Driven Development (SDD)
All implementation must strictly follow approved specifications. No code is written without:
- An explicit, written feature specification (spec.md)
- An approved implementation plan (plan.md)
- A complete task breakdown (tasks.md)

Every change MUST be traceable to a spec requirement. Ad-hoc coding is prohibited. Specifications for AI agents must include natural language processing requirements, conversation flow definitions, and tool integration contracts.

**Rationale**: Spec-first ensures alignment between business intent, technical design, and implementation. Prevents scope creep and rework. Extended to ensure AI agent behavior is predictable and aligned with user requirements.

### II. Agentic Workflow Compliance
Development execution follows the Agentic Dev Stack workflow exclusively:
- Specification → Planning → Task Breakdown → Implementation via specialized agents
- No manual coding; all code generated through Claude agents (frontend-builder, fastapi-backend-developer, database-skill, auth-skill)
- Additional AI agent development using OpenAI Agents SDK for natural language interaction
- Agents operate on approved specs and plans; humans validate at checkpoints

**Rationale**: Agentic execution ensures consistency, reproducibility, and deterministic code quality. Specialized agents enforce best practices for each layer. Extended to include AI agents that process natural language requests and coordinate with MCP tools.

### III. Security-First Design
Authentication, authorization, and user isolation are enforced by default in every component:
- All user data is scoped by authenticated user_id
- Every API endpoint requires valid JWT token after signup/signin
- Passwords are never stored in logs or API responses
- Secrets stored in .env only; never hardcoded
- SQL injection, XSS, and CSRF protections enforced by framework/ORM
- AI agent conversations are user-scoped and isolated
- AI actions are audited and logged with user context

**Rationale**: Security as a system property prevents breach. User scoping prevents data leakage across users. Enhanced to protect AI agent interactions and maintain user privacy in conversations.

### IV. Deterministic Behavior
All APIs and UI must behave consistently across users and sessions:
- Same input → same output (no race conditions, no order-dependent behavior)
- Error responses use consistent HTTP status codes (401 for auth, 403 for permission, 400 for validation, 500 for server errors)
- Errors are explicit and documented
- No silent failures; all failure paths logged and returned to client
- Statelessness: AI agents maintain no persistent state between requests

**Rationale**: Predictable behavior enables reliable client code and easier debugging. Determinism is foundational to a multi-user system. Extended to ensure AI interactions are stateless and reproducible.

### V. Full-Stack Coherence
Frontend, backend, database, and AI agent layers must integrate without mismatches:
- API contracts (endpoints, request/response schema) defined in backend spec
- Frontend implementation matches backend contract exactly
- Database schema migrations tracked and documented
- AI agent tool contracts defined and validated
- MCP tools follow strict schema definitions
- Deployment is atomic; all layers updated together

**Rationale**: Coherence prevents integration surprises. Contracts prevent frontend/backend drift. Extended to ensure AI agent layer integrates seamlessly with existing architecture.

### VI. Technology Stack Non-Negotiability
The following technology stack is fixed and mandatory. No substitutions or additions without explicit architecture decision:
- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)
- **AI Agent**: OpenAI Agents SDK
- **MCP Tools**: Official MCP SDK
- **Conversation Persistence**: Neon PostgreSQL (conversations and messages)

All code must use these technologies exclusively.

**Rationale**: Fixed stack eliminates decision paralysis, enforces consistency, and aligns with Hackathon requirements. Extended to include AI-specific technologies.

### VII. AI Agent-First Architecture
AI agent design follows agent-first principles with strict separation of concerns:
- Clear separation: UI → Agent → MCP Tools → Database
- AI agents must not access the database directly; all data access via MCP tools
- Stateless chat and tool execution
- Natural language requests translated to structured tool calls
- Agent responses formatted for UI consumption

**Rationale**: Agent-first design enables natural language interaction with the system while maintaining clean architectural boundaries. Ensures AI agents operate through well-defined interfaces.

### VIII. MCP Tool Compliance
All task actions must be executed exclusively through MCP tools with strict requirements:
- MCP tools must be stateless and schema-defined
- All actions are traceable and persisted in database
- Tools follow official MCP SDK standards
- Conversation context rebuilt from database each request
- Tools enforce user scoping and authentication

**Rationale**: MCP tool compliance ensures all actions are properly logged, auditable, and maintain security boundaries. Enables stateless AI agent operation while preserving data integrity.

## Mandatory Workflow

Development follows this invariant order. No skipping phases:

1. **Specification** (`/sp.specify`)
   - User story scenarios (prioritized by business value)
   - Functional + non-functional requirements (explicit, testable)
   - Key entities and their relationships
   - Success criteria (measurable outcomes)
   - AI agent conversation flows and natural language requirements
   - MCP tool contracts and schema definitions

2. **Planning** (`/sp.plan`)
   - Architecture and technology choices with rationale
   - Scope boundary (in/out)
   - API contracts (if backend feature)
   - Data model or schema (if data storage)
   - Non-functional requirements (performance, security, reliability)
   - AI agent architecture and integration points
   - MCP tool design and implementation plan

3. **Task Breakdown** (`/sp.tasks`)
   - Independent, testable tasks for each user story
   - Dependency graph and execution order
   - Phase structure: Setup → Foundational → User Story 1 → User Story 2 → Polish
   - Each task assigns: file paths, acceptance criteria, test coverage
   - AI agent development tasks and MCP tool implementation tasks
   - Conversation persistence and state management tasks

4. **Implementation** (`/sp.implement`)
   - Execute tasks via specialized agents
   - Each agent validates compliance with spec/plan
   - Tasks completed and tested in dependency order
   - Prompt History Records (PHRs) created for every major step
   - AI agent and MCP tool implementations follow spec compliance

No implementation begins until all prior phases are approved.

## Security & Authentication Requirements

- **User Isolation**: Every query, API response, and UI element filtered by authenticated user_id
- **JWT Tokens**: Stateless, signed, verified on every protected endpoint
- **Password Hashing**: Delegated to Better Auth; never handled directly
- **Secrets Management**: All secrets (DB URL, JWT secret, API keys) in .env, never in code
- **CORS Policy**: Frontend domain registered in backend CORS config
- **Audit Trail**: Login events and sensitive operations logged with timestamps
- **AI Agent Security**: AI agent conversations are user-scoped and isolated; no cross-user data exposure
- **MCP Tool Security**: All MCP tools enforce user authentication and authorization
- **Conversation Privacy**: AI conversation history is encrypted and accessible only to owning user
- **Tool Access Control**: AI agents can only invoke authorized MCP tools on behalf of authenticated users

## API & REST Standards

- **Endpoints**: RESTful, resource-based (`/api/todos`, `/api/auth/signin`, `/api/chat`)
- **Stateless Chat Endpoint**: `/api/chat` accepts natural language requests and returns structured responses
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
- **Chat Response Format**: `{ "response": "natural language response", "actions": [...], "conversation_id": "..." }`

## Error Handling & Documentation

- **Explicit Error Paths**: Every API spec documents error scenarios (400, 401, 403, 404, 500)
- **Client Feedback**: Errors returned to frontend; frontend displays user-friendly messages
- **Logging**: All errors logged server-side with context (user_id, endpoint, timestamp, stack trace)
- **No Silent Failures**: Missing data, validation failures, permission denials all returned explicitly
- **API Documentation**: OpenAPI/Swagger spec generated from backend; frontend references it
- **AI Agent Error Handling**: AI agent errors logged with conversation context and user identity
- **MCP Tool Error Propagation**: MCP tool errors propagated to AI agent and ultimately to user with appropriate messaging
- **Conversation Recovery**: Error states in conversations allow recovery without loss of context

## Code & Quality Standards

- **Type Safety**: TypeScript on frontend, type hints on backend (Pydantic models)
- **Testing**: Unit tests for business logic, integration tests for API contracts, E2E tests for user journeys, AI agent behavior tests
- **Code Review**: All changes reviewed against spec compliance and security requirements
- **Documentation**: READMEs, API docs, architecture decisions (ADRs) for significant choices, AI agent interaction flows
- **Performance**: API response time p95 < 200ms, frontend load time < 3s on 3G, AI chat response time < 2s
- **Accessibility**: WCAG 2.1 AA on frontend; no hardcoded colors/sizes
- **AI Agent Standards**: Natural language processing accuracy, conversation coherence, tool invocation correctness
- **MCP Tool Standards**: Schema compliance, statelessness, error handling, audit logging

## Governance

**Compliance Verification**:
- Every PR/commit must reference its spec and plan
- Code reviews verify: spec compliance, security enforcement, deterministic behavior, test coverage
- Architectural decisions (framework choices, API redesigns, schema changes) require Architectural Decision Records (ADRs)
- AI agent and MCP tool implementations verified for compliance with separation requirements

**Amendment Procedure**:
- Constitution changes require explicit user consent
- Changes trigger version bump: MAJOR (backward-incompatible), MINOR (additions), PATCH (clarifications)
- Amended sections update dependent templates (spec, plan, tasks, command files)

**Prompt History Records**:
- Every user prompt recorded in `history/prompts/` (constitution, feature-name, or general subdirectory)
- PHR captures: input (verbatim), output (concise summary), stage, date, model, files modified, tests run
- PHRs enable traceability and learning; automatic garbage collection after 90 days
- AI agent interactions and MCP tool invocations also recorded for traceability

**Architectural Decision Records**:
- Significant decisions (long-term impact, alternatives considered, cross-cutting scope) documented as ADRs
- ADRs stored in `history/adr/`
- Suggested by `/sp.adr` command; never auto-created without user consent

**Version & Compliance Audit**:
- Constitution version shown in header (semantic versioning)
- Quarterly review: spec coverage, incident log review, principle effectiveness assessment
- Violations escalated; mitigation recorded
- AI agent behavior audits to ensure adherence to architectural principles

**AI Agent Governance**:
- All AI actions must be traceable and persisted in database
- Conversation context must be rebuilt from database each request
- No manual coding allowed; all AI agent and MCP tool development via Claude Code only
- Strict separation maintained: UI → Agent → MCP Tools → Database

**Version**: 1.1.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-02-11
