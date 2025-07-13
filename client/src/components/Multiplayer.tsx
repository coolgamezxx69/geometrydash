import { useState } from "react";
import { useMenu } from "../lib/stores/useMenu";
import { useAuth } from "../lib/stores/useAuth";
import { useMultiplayer } from "../lib/stores/useMultiplayer";
import NeonButton from "./NeonButton";

export default function Multiplayer() {
  const { setCurrentScreen } = useMenu();
  const { user } = useAuth();
  const { 
    coins, 
    friends, 
    gameModes, 
    currentRace, 
    availableRooms,
    addFriend,
    removeFriend,
    createRaceRoom,
    joinRaceRoom,
    leaveRaceRoom,
    setPlayerReady,
    spendCoins
  } = useMultiplayer();

  const [activeTab, setActiveTab] = useState<"friends" | "race" | "shop">("friends");
  const [friendInput, setFriendInput] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(2);

  const handleAddFriend = () => {
    if (!friendInput.trim()) return;

    // Simulate finding friend by username or friend code
    const newFriend = {
      id: `friend-${Date.now()}`,
      username: friendInput.includes("#") ? friendInput.split("#")[0] : friendInput,
      friendCode: friendInput.includes("#") ? friendInput : `${friendInput}#${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: Math.random() > 0.5 ? "online" : "offline" as const,
      lastSeen: new Date()
    };

    addFriend(newFriend);
    setFriendInput("");
  };

  const handleCreateRoom = () => {
    createRaceRoom(selectedLevel, maxPlayers);
    setShowCreateRoom(false);
  };

  const handleBuyLevel = (levelId: number) => {
    const cost = levelId * 2; // 2, 4, 6, 8, etc.
    if (spendCoins(cost)) {
      // In a real implementation, this would unlock the level
      alert(`Level ${levelId} purchased for ${cost} coins!`);
    } else {
      alert("Not enough coins!");
    }
  };

  const getLevelCost = (levelId: number) => levelId * 2;

  const levels = [
    { id: 1, name: "Stereo Madness", unlocked: true },
    { id: 2, name: "Back On Track", unlocked: false },
    { id: 3, name: "Polargeist", unlocked: false },
    { id: 4, name: "Dry Out", unlocked: false },
    { id: 5, name: "Base After Base", unlocked: false },
    { id: 6, name: "Can't Let Go", unlocked: false },
    { id: 7, name: "Jumper", unlocked: false },
    { id: 8, name: "Time Machine", unlocked: false },
  ];

  if (!user) {
    return (
      <div className="multiplayer-container">
        <div className="section-header">
          <h2 className="section-title">MULTIPLAYER</h2>
          <p className="login-required">Please log in to access multiplayer features</p>
        </div>
        <div className="back-button-container">
          <NeonButton onClick={() => setCurrentScreen("main")} color="red" size="medium">
            BACK
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="multiplayer-container">
      <div className="section-header">
        <h2 className="section-title">MULTIPLAYER</h2>
        <div className="coins-display">
          <span className="coins-icon">💰</span>
          <span className="coins-amount">{coins} Coins</span>
        </div>
      </div>

      <div className="multiplayer-tabs">
        <NeonButton 
          onClick={() => setActiveTab("friends")}
          color={activeTab === "friends" ? "blue" : "gray"}
          size="medium"
        >
          FRIENDS
        </NeonButton>
        <NeonButton 
          onClick={() => setActiveTab("race")}
          color={activeTab === "race" ? "blue" : "gray"}
          size="medium"
        >
          RACING
        </NeonButton>
        <NeonButton 
          onClick={() => setActiveTab("shop")}
          color={activeTab === "shop" ? "blue" : "gray"}
          size="medium"
        >
          SHOP
        </NeonButton>
      </div>

      <div className="multiplayer-content">
        {activeTab === "friends" && (
          <div className="friends-section">
            <div className="add-friend-container">
              <input
                type="text"
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
                placeholder="Username or Friend Code (e.g., Player#1234)"
                className="friend-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
              />
              <NeonButton onClick={handleAddFriend} color="green" size="medium">
                ADD FRIEND
              </NeonButton>
            </div>

            <div className="friends-list">
              <h3>Friends ({friends.length})</h3>
              {friends.length === 0 ? (
                <p className="no-friends">No friends yet. Add some!</p>
              ) : (
                friends.map((friend) => (
                  <div key={friend.id} className="friend-item">
                    <div className="friend-info">
                      <span className="friend-name">{friend.username}</span>
                      <span className="friend-code">{friend.friendCode}</span>
                      <span className={`friend-status ${friend.status}`}>
                        {friend.status === "online" ? "🟢" : friend.status === "in-game" ? "🎮" : "⚫"} 
                        {friend.status}
                      </span>
                    </div>
                    <NeonButton 
                      onClick={() => removeFriend(friend.id)}
                      color="red" 
                      size="small"
                    >
                      REMOVE
                    </NeonButton>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "race" && (
          <div className="racing-section">
            {currentRace ? (
              <div className="current-race">
                <h3>Current Race: {currentRace.name}</h3>
                <p>Level: {levels.find(l => l.id === currentRace.levelId)?.name}</p>
                <div className="race-players">
                  {currentRace.players.map((player) => (
                    <div key={player.id} className="race-player">
                      <span>{player.username}</span>
                      <span className={player.ready ? "ready" : "not-ready"}>
                        {player.ready ? "✅ Ready" : "⏳ Not Ready"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="race-controls">
                  <NeonButton 
                    onClick={() => setPlayerReady(true)} 
                    color="green" 
                    size="medium"
                  >
                    READY
                  </NeonButton>
                  <NeonButton 
                    onClick={leaveRaceRoom} 
                    color="red" 
                    size="medium"
                  >
                    LEAVE RACE
                  </NeonButton>
                </div>
                <button
                  onClick={() => {
                    console.log("Starting race game...");
                    // TODO: Implement race game logic
                    alert("Race game functionality coming soon!");
                  }}
                  className="multiplayer-button"
                >
                  Start Game
                </button>
              </div>
            ) : (
              <div className="race-lobby">
                <div className="game-modes">
                  <h3>Game Modes</h3>
                  {gameModes.map((mode) => (
                    <div key={mode.id} className="game-mode">
                      <h4>{mode.name}</h4>
                      <p>{mode.description}</p>
                      <p>Reward: {mode.reward} coins</p>
                    </div>
                  ))}
                </div>

                <div className="race-rooms">
                  <div className="rooms-header">
                    <h3>Available Races</h3>
                    <NeonButton 
                      onClick={() => setShowCreateRoom(true)}
                      color="green" 
                      size="medium"
                    >
                      CREATE RACE
                    </NeonButton>
                  </div>

                  {availableRooms.map((room) => (
                    <div key={room.id} className="race-room">
                      <div className="room-info">
                        <h4>{room.name}</h4>
                        <p>Level: {levels.find(l => l.id === room.levelId)?.name}</p>
                        <p>Players: {room.players.length}/{room.maxPlayers}</p>
                      </div>
                      <NeonButton 
                        onClick={() => joinRaceRoom(room.id)}
                        color="blue" 
                        size="medium"
                        disabled={room.players.length >= room.maxPlayers}
                      >
                        {room.players.length >= room.maxPlayers ? "FULL" : "JOIN"}
                      </NeonButton>
                    </div>
                  ))}
                </div>

                {showCreateRoom && (
                  <div className="create-room-modal">
                    <div className="modal-content">
                      <h3>Create Race Room</h3>
                      <div className="form-group">
                        <label>Level:</label>
                        <select 
                          value={selectedLevel} 
                          onChange={(e) => setSelectedLevel(Number(e.target.value))}
                          className="level-select"
                        >
                          {levels.filter(l => l.unlocked).map(level => (
                            <option key={level.id} value={level.id}>
                              {level.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Max Players:</label>
                        <input 
                          type="number" 
                          min="2" 
                          max="8" 
                          value={maxPlayers}
                          onChange={(e) => setMaxPlayers(Number(e.target.value))}
                          className="players-input"
                        />
                      </div>
                      <div className="modal-buttons">
                        <NeonButton onClick={handleCreateRoom} color="green" size="medium">
                          CREATE
                        </NeonButton>
                        <NeonButton 
                          onClick={() => setShowCreateRoom(false)} 
                          color="red" 
                          size="medium"
                        >
                          CANCEL
                        </NeonButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "shop" && (
          <div className="shop-section">
            <h3>Level Shop</h3>
            <p className="shop-description">
              Purchase levels ahead of your progress! Prices increase: 2, 4, 6, 8 coins...
            </p>
            <div className="shop-levels">
              {levels.slice(1).map((level) => (
                <div key={level.id} className={`shop-level ${level.unlocked ? 'owned' : ''}`}>
                  <div className="level-info">
                    <h4>{level.name}</h4>
                    <p>Level {level.id}</p>
                  </div>
                  <div className="level-price">
                    {level.unlocked ? (
                      <span className="owned-badge">OWNED</span>
                    ) : (
                      <>
                        <span className="price">{getLevelCost(level.id)} coins</span>
                        <NeonButton 
                          onClick={() => handleBuyLevel(level.id)}
                          color={coins >= getLevelCost(level.id) ? "green" : "gray"}
                          size="small"
                          disabled={coins < getLevelCost(level.id)}
                        >
                          BUY
                        </NeonButton>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="back-button-container">
        <NeonButton onClick={() => setCurrentScreen("main")} color="red" size="medium">
          BACK
        </NeonButton>
      </div>
    </div>
  );
}