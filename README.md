DrMarioRemake-Frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── core/                                # Shared modules across contexts
│   │   ├── domain/                         # Reusable domain logic (e.g., base entities, value objects)
│   │   │   ├── Entity.ts                   # Base class for aggregates/entities in DDD
│   │   │   ├── ValueObject.ts              # Base class for value objects
│   │   │   ├── DomainEvents.ts             # Domain events system
│   │   ├── utils/                          # Shared utilities like date/time helpers
│   │   ├── infrastructure/                 # Shared infrastructure for all contexts
│   │   │   ├── httpClient.ts               # HTTP client wrapper (e.g., Axios or Fetch API)
│   │   │   ├── WebSocketClient.ts          # Reusable WebSocket wrapper
│   │   ├── globalTypes/                    # Globally shared types (e.g., User, ErrorState)
│   │   ├── state/                          # Shared global state handling
│   │   │   ├── store.ts                    # Centralized state configuration (Redux, Zustand, etc.)
│   │   │   ├── models/
│   │   │   │   ├── AuthState.ts
│   │   │   │   ├── GameState.ts
│   ├── modules/                            # Feature/Biz logic encapsulated by Bounded Contexts
│   │   ├── game/                           # Game-specific bounded context
│   │   │   ├── domain/                     # Game-specific rules/entities (DDD domain layer)
│   │   │   │   ├── GameModel.ts
│   │   │   │   ├── Player.ts
│   │   │   │   ├── GameRules.ts
│   │   │   ├── application/                # Commands, Queries, Ports (Application Layer)
│   │   │   │   ├── commands/               # Write operations (CQRS - Command side)
│   │   │   │   │   ├── StartGameCommand.ts
│   │   │   │   │   ├── EndGameCommand.ts
│   │   │   │   ├── queries/                # Read operations (CQRS - Query side)
│   │   │   │   │   ├── GetGameStateQuery.ts
│   │   │   │   ├── ports/                  # Interfaces (Ports for APIs, WebSocket adapters)
│   │   │   │       ├── IGameAPI.ts
│   │   │   │       ├── IGameWebSocket.ts
│   │   │   ├── infrastructure/             # Adapters (Infrastructure Layer)
│   │   │   │   ├── GameAPI.ts              # Implements IGameAPI
│   │   │   │   ├── GameWebSocketAdapter.ts # Implements IGameWebSocket
│   │   │   ├── presentation/               # Game-related UI (Presentation Layer)
│   │   │   │   ├── components/             # Dumb/reusable UI components in game
│   │   │   │   │   ├── GameBoard.tsx
│   │   │   │   │   ├── ScoreDisplay.tsx
│   │   │   │   ├── pages/                  # Page-level components for routing
│   │   │   │       ├── GamePage.tsx
│   │   ├── tournament/                     # Tournament-specific bounded context
│   │   │   ... (same structure as game)
│   │   ├── chat/                           # Chat-specific bounded context
│   │   │   ... (same structure as game)
│   │   ├── friends/                        # Friends management
│   │   │   ... (same structure as game)
│   │   ├── stats/                          # Match statistics
│   │   │   ... (same structure as game)
│   ├── app/                                # Application-wide setup
│   │   ├── Router.tsx                      # Centralized React Router config
│   │   ├── App.tsx                         # Root entry point React component
│   ├── main.tsx                            # App bootstrap and dependency injection
├── package.json
├── tsconfig.json
└── README.md