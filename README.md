DrMarioRemake-Frontend/
├── public/                     
│   ├── index.html              
│   └── assets/                 
├── src/
│   ├── domain/                   # Regras do jogo no frontend
│   │   ├── game/                 
│   │   │   ├── GameModel.ts      # Estado do jogo no cliente
│   │   │   ├── GameRules.ts      # Regras locais do jogo
│   │   ├── multiplayer/          
│   │   │   ├── Player.ts         
│   │   │   ├── Session.ts        
│   │   ├── chat/                 
│   │   │   ├── ChatMessage.ts    
│   │   │   ├── ChatRoom.ts       
│   │   ├── tournament/           
│   │       ├── Tournament.ts     
│   ├── application/              # Serviços que se comunicam com a API
│   │   ├── game/
│   │   │   ├── GameService.ts    # Lida com WebSockets e API REST
│   │   ├── multiplayer/
│   │   │   ├── MultiplayerService.ts
│   │   ├── chat/
│   │   │   ├── ChatService.ts    
│   │   ├── tournament/
│   │   │   ├── TournamentService.ts
│   ├── infrastructure/           # Comunicação com backend
│   │   ├── api/
│   │   │   ├── httpClient.ts     # Cliente para API REST
│   │   │   ├── endpoints.ts      # Endpoints da API
│   │   ├── websocket/
│   │   │   ├── socket.ts         # Cliente WebSocket
│   │   │   ├── gameEvents.ts     # Eventos WebSocket do jogo
│   │   │   ├── chatEvents.ts     # Eventos WebSocket do chat
│   │   │   ├── multiplayerEvents.ts  
│   ├── presentation/             # Interface do usuário
│   │   ├── components/           
│   │   │   ├── game/             
│   │   │   ├── chat/             
│   │   │   ├── multiplayer/      
│   │   │   ├── tournament/       
│   │   ├── pages/
│   │   │   ├── HomePage.ts       
│   │   │   ├── GamePage.ts       
│   │   │   ├── TournamentPage.ts
│   │   ├── index.ts              
│   ├── utils/                    
│   ├── main.ts                   
├── package.json                  
├── tsconfig.json                 
└── README.md                     
