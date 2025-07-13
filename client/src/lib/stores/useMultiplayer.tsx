
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Friend {
  id: string;
  username: string;
  friendCode: string;
  status: "online" | "offline" | "in-game";
  lastSeen?: Date;
}

export interface RaceRoom {
  id: string;
  name: string;
  levelId: number;
  players: {
    id: string;
    username: string;
    ready: boolean;
    finished?: boolean;
    time?: number;
  }[];
  status: "waiting" | "starting" | "racing" | "finished";
  createdBy: string;
  maxPlayers: number;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  reward: number; // coins for winner
}

interface MultiplayerState {
  // Player data
  coins: number;
  friends: Friend[];
  
  // Game modes
  gameModes: GameMode[];
  
  // Racing
  currentRace: RaceRoom | null;
  availableRooms: RaceRoom[];
  
  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  createRaceRoom: (levelId: number, maxPlayers: number) => void;
  joinRaceRoom: (roomId: string) => void;
  leaveRaceRoom: () => void;
  setPlayerReady: (ready: boolean) => void;
  finishRace: (time: number) => void;
}

export const useMultiplayer = create<MultiplayerState>()(
  persist(
    (set, get) => ({
      coins: 10, // Starting coins
      friends: [],
      
      gameModes: [
        {
          id: "classic-race",
          name: "Classic Race",
          description: "Race to the finish line. Winner takes all!",
          minPlayers: 2,
          maxPlayers: 4,
          reward: 5
        },
        {
          id: "time-trial",
          name: "Time Trial",
          description: "Beat the best time. Fastest player wins!",
          minPlayers: 2,
          maxPlayers: 8,
          reward: 3
        },
        {
          id: "survival",
          name: "Survival Mode",
          description: "Last player standing wins coins!",
          minPlayers: 3,
          maxPlayers: 6,
          reward: 8
        }
      ],
      
      currentRace: null,
      availableRooms: [
        {
          id: "room-1",
          name: "Stereo Madness Speed Run",
          levelId: 1,
          players: [
            { id: "bot-1", username: "SpeedDemon", ready: true },
            { id: "bot-2", username: "DashMaster", ready: false }
          ],
          status: "waiting",
          createdBy: "bot-1",
          maxPlayers: 4
        },
        {
          id: "room-2", 
          name: "Back On Track Challenge",
          levelId: 2,
          players: [
            { id: "bot-3", username: "GeometryPro", ready: true }
          ],
          status: "waiting",
          createdBy: "bot-3",
          maxPlayers: 3
        }
      ],
      
      addCoins: (amount) => {
        set((state) => ({ coins: state.coins + amount }));
      },
      
      spendCoins: (amount) => {
        const { coins } = get();
        if (coins >= amount) {
          set({ coins: coins - amount });
          return true;
        }
        return false;
      },
      
      addFriend: (friend) => {
        set((state) => ({
          friends: [...state.friends.filter(f => f.id !== friend.id), friend]
        }));
      },
      
      removeFriend: (friendId) => {
        set((state) => ({
          friends: state.friends.filter(f => f.id !== friendId)
        }));
      },
      
      createRaceRoom: (levelId, maxPlayers) => {
        const { user } = useAuth.getState();
        if (!user) return;
        
        const newRoom: RaceRoom = {
          id: `room-${Date.now()}`,
          name: `${user.username}'s Race`,
          levelId,
          players: [{
            id: user.id,
            username: user.username,
            ready: false
          }],
          status: "waiting",
          createdBy: user.id,
          maxPlayers
        };
        
        set((state) => ({
          availableRooms: [...state.availableRooms, newRoom],
          currentRace: newRoom
        }));
      },
      
      joinRaceRoom: (roomId) => {
        const { user } = useAuth.getState();
        if (!user) return;
        
        set((state) => {
          const room = state.availableRooms.find(r => r.id === roomId);
          if (!room || room.players.length >= room.maxPlayers) return state;
          
          const updatedRoom = {
            ...room,
            players: [...room.players, {
              id: user.id,
              username: user.username,
              ready: false
            }]
          };
          
          return {
            availableRooms: state.availableRooms.map(r => 
              r.id === roomId ? updatedRoom : r
            ),
            currentRace: updatedRoom
          };
        });
      },
      
      leaveRaceRoom: () => {
        set({ currentRace: null });
      },
      
      setPlayerReady: (ready) => {
        const { user } = useAuth.getState();
        if (!user) return;
        
        set((state) => {
          if (!state.currentRace) return state;
          
          const updatedRoom = {
            ...state.currentRace,
            players: state.currentRace.players.map(p =>
              p.id === user.id ? { ...p, ready } : p
            )
          };
          
          return {
            currentRace: updatedRoom,
            availableRooms: state.availableRooms.map(r =>
              r.id === updatedRoom.id ? updatedRoom : r
            )
          };
        });
      },
      
      finishRace: (time) => {
        const { user } = useAuth.getState();
        if (!user) return;
        
        set((state) => {
          if (!state.currentRace) return state;
          
          const updatedRoom = {
            ...state.currentRace,
            players: state.currentRace.players.map(p =>
              p.id === user.id ? { ...p, finished: true, time } : p
            )
          };
          
          // Check if all players finished
          const allFinished = updatedRoom.players.every(p => p.finished);
          if (allFinished) {
            updatedRoom.status = "finished";
            
            // Award coins to winner (fastest time)
            const winner = updatedRoom.players.reduce((prev, current) => 
              (prev.time || Infinity) < (current.time || Infinity) ? prev : current
            );
            
            if (winner.id === user.id) {
              // Player won! Award coins
              const gameMode = state.gameModes.find(gm => gm.id === "classic-race");
              if (gameMode) {
                get().addCoins(gameMode.reward);
              }
            }
          }
          
          return {
            currentRace: updatedRoom,
            availableRooms: state.availableRooms.map(r =>
              r.id === updatedRoom.id ? updatedRoom : r
            )
          };
        });
      }
    }),
    {
      name: "multiplayer-storage"
    }
  )
);

// Import useAuth to use in the store
import { useAuth } from "./useAuth";
