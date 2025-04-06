DrMarioRemake-Frontend/
├── public/
│   ├── index.html              # Entry HTML file
│   └── assets/                 # Static resources (images, CSS, etc.)
│
├── src/
│   ├── domain/                 # Domain Layer (Core business logic and rules)
│   │   ├── game/               # Game-related logic and rules
│   │   │   ├── GameModel.ts    # Represents the local state of the game
│   │   │   ├── GameRules.ts    # Business rules governing the game
│   │   ├── multiplayer/        # Multiplayer-related domain logic
│   │   │   ├── Player.ts       # Player domain model
│   │   │   ├── Session.ts      # Represents a multiplayer session
│   │   ├── chat/               # Chat-related domain logic
│   │   │   ├── ChatMessage.ts  # Represents a chat message in the domain
│   │   │   ├── ChatRoom.ts     # Represents a chat room in the domain
│   │   ├── tournament/         # Tournament-related domain logic
│   │       ├── Tournament.ts   # Tournament domain model
│   │
│   ├── application/            # Application Layer (Ports / services / use-cases)
│   │   ├── game/
│   │   │   ├── GameService.ts             # Orchestrates game-related use-cases
│   │   │   ├── IGameAPI.ts                # Interface defining API contract for the game
│   │   ├── chat/
│   │   │   ├── ChatService.ts             # Orchestrates chat-related use-cases
│   │   │   ├── IChatAPI.ts                # Interface defining API contract for chat
│   │   ├── multiplayer/
│   │   │   ├── MultiplayerService.ts      # Multiplayer-related service
│   │   │   ├── IMultiplayerAPI.ts         # Interface defining API contract for multiplayer
│   │   ├── tournament/
│   │   │   ├── TournamentService.ts       # Tournament service
│   │   │   ├── ITournamentAPI.ts          # Interface for tournament API
│   │
│   ├── infrastructure/         # Infrastructure Layer (Adapters for external systems)
│   │   ├── api/
│   │   │   ├── GameAPI.ts      # Implementation of the IGameAPI interface
│   │   │   ├── ChatAPI.ts      # Implementation of the IChatAPI interface
│   │   │   ├── MultiplayerAPI.ts
│   │   │   ├── TournamentAPI.ts
│   │   ├── websocket/
│   │   │   ├── WebSocketHandler.ts
|   │   |   ├── GameWebSocket.ts
│   │
│   ├── presentation/           # Presentation Layer (UI, views, and components)
│   │   ├── components/
│   │   │   ├── game/              # Components specific to the game
│   │   │   ├── chat/              # Components specific to chat
│   │   │   ├── multiplayer/       # Components specific to multiplayer
│   │   │   ├── tournament/        # Components specific to tournaments
│   │   ├── pages/
│   │   │   ├── HomePage.ts        # Home page for navigation
│   │   │   ├── GamePage.ts        # Game page
│   │   │   ├── TournamentPage.ts  # Tournament page
│   │   ├── index.ts               # Presentation entry point
│   │
│   ├── utils/                  # Utility functions and helpers
│   ├── main.ts   
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md   

