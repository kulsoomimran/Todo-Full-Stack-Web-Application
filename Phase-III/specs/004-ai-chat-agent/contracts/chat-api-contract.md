# API Contract: Chat Functionality

This document defines the API endpoints and data structures for the AI Chat Agent functionality.

## Base Path

`/api/v1/chat`

## Endpoints

---

### `POST /message`

**Description**: Sends a user message to the AI agent and receives a response. Persists both the user's message and the AI's response, and manages conversation state.

**Request**

- **Method**: `POST`
- **Path**: `/api/v1/chat/message`
- **Content-Type**: `application/json`
- **Body**: `ChatMessageRequest`
    ```json
    {
      "message": "string",
      "conversation_id": "string (UUID, optional)"
    }
    ```
    - `message`: The user's input message.
    - `conversation_id`: (Optional) The ID of an existing conversation to continue. If not provided, a new conversation will be initiated.

**Response**

- **Status Code**: `200 OK`
- **Content-Type**: `application/json`
- **Body**: `ChatMessageResponse`
    ```json
    {
      "conversation_id": "string (UUID)",
      "message_id": "string (UUID)",
      "role": "string ('user' or 'assistant')",
      "content": "string",
      "timestamp": "string (datetime ISO format)"
    }
    ```
    - `conversation_id`: The ID of the conversation.
    - `message_id`: The ID of the AI's response message.
    - `role`: The role of the sender (e.g., "assistant").
    - `content`: The AI's response message.
    - `timestamp`: The timestamp when the AI's response was generated/persisted.

**Error Responses**

- `404 Not Found`:
    ```json
    {
      "detail": "Conversation with ID <UUID> not found.",
      "status_code": 404
    }
    ```
    - Occurs if `conversation_id` is provided but no matching conversation is found.
- `422 Unprocessable Entity`:
    ```json
    {
      "detail": "Validation error",
      "errors": [ ... ],
      "status_code": 422
    }
    ```
    - Occurs if the request body fails Pydantic validation.
- `500 Internal Server Error`:
    ```json
    {
      "detail": "Internal server error",
      "status_code": 500
    }
    ```
    - For unexpected server-side errors.

---

### `GET /message/{conversation_id}`

**Description**: Retrieves the full conversation history for a given conversation ID.

**Request**

- **Method**: `GET`
- **Path**: `/api/v1/chat/message/{conversation_id}`
    - `conversation_id`: Path parameter (UUID) representing the ID of the conversation to retrieve.

**Response**

- **Status Code**: `200 OK`
- **Content-Type**: `application/json`
- **Body**: `List[ChatMessageResponse]`
    ```json
    [
      {
        "conversation_id": "string (UUID)",
        "message_id": "string (UUID)",
        "role": "string ('user', 'assistant', 'system', 'tool')",
        "content": "string",
        "timestamp": "string (datetime ISO format)"
      },
      ...
    ]
    ```
    - Returns a list of `ChatMessageResponse` objects, ordered by `timestamp`.

**Error Responses**

- `404 Not Found`:
    ```json
    {
      "detail": "Conversation with ID <UUID> not found.",
      "status_code": 404
    }
    ```
    - Occurs if `conversation_id` does not match any existing conversation.
- `500 Internal Server Error`:
    ```json
    {
      "detail": "Internal server error",
      "status_code": 500
    }
    ```
    - For unexpected server-side errors.
