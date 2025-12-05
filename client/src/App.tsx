import { useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import GameView from './components/GameView';
import Notification from './components/Notification';
import SettingsMenu from './components/SettingsMenu';
import { IconLock, IconRefresh, IconPalette, IconPaw, IconPizza, IconBox, IconStar, IconFilm, IconGamepad, IconBall } from './components/Icons';

function App() {
  const { connect, isConnected, joinRoom, gameState, rooms, notification, clearNotification, getRooms, showNotification } = useGameStore();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  // Form States
  const [createRoomId, setCreateRoomId] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [maxScore, setMaxScore] = useState(120);
  const [theme, setTheme] = useState('general');

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    connect();
  }, [connect]);

  // State to track if we should auto-join
  const [pendingAutoJoin, setPendingAutoJoin] = useState<string | null>(null);

  // Handle URL routing - check for room in URL
  useEffect(() => {
    // Check URL on load
    const path = window.location.pathname.substring(1); // Remove leading slash
    if (path && path.length > 0) {
      setJoinRoomId(path);
      setActiveTab('join');
      // Mark for auto-join attempt
      setPendingAutoJoin(path);
    }
  }, []);

  // Auto-join when connected and have saved name
  useEffect(() => {
    if (pendingAutoJoin && isConnected && !gameState && rooms.length > 0) {
      const savedName = localStorage.getItem('playerName');
      if (savedName) {
        // Check if room exists and is locked
        const targetRoom = rooms.find(r => r.roomId === pendingAutoJoin);

        if (targetRoom?.isLocked) {
          // Room is password protected - show password modal
          setPlayerName(savedName);
          setJoinRoomId(pendingAutoJoin);
          setShowPasswordModal(true);
          setPendingAutoJoin(null);
        } else {
          // Room is not locked or doesn't exist (will be created) - auto-join
          const customAvatar = '/assets/Es_line_sticker.webp';
          joinRoom(pendingAutoJoin, savedName, undefined, undefined, undefined, undefined, customAvatar);
          setPendingAutoJoin(null);
        }
      } else {
        // No saved name, just show the join form
        setPendingAutoJoin(null);
      }
    }
  }, [pendingAutoJoin, isConnected, gameState, joinRoom, rooms]);

  // Update URL when game state changes
  useEffect(() => {
    if (gameState?.roomId) {
      window.history.pushState({}, '', `/${gameState.roomId}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  }, [gameState?.roomId]);

  // Load saved name
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) setPlayerName(savedName);
  }, []);

  // Save name on change
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('playerName', playerName);
    }
  }, [playerName]);

  const handleCreate = () => {
    if (!playerName || !createRoomId) {
      showNotification("Please enter name and room ID", "error");
      return;
    }
    // Use custom avatar
    const customAvatar = '/assets/Es_line_sticker.webp';
    joinRoom(createRoomId, playerName, createPassword, maxPlayers, theme, maxScore, customAvatar);
  };

  const handleJoinClick = () => {
    if (!playerName || !joinRoomId) {
      showNotification("Please enter name and select a room", "error");
      return;
    }

    const selectedRoom = rooms.find(r => r.roomId === joinRoomId);
    if (selectedRoom?.isLocked) {
      setJoinPassword(''); // Reset password field
      setShowPasswordModal(true);
    } else {
      const customAvatar = '/assets/Es_line_sticker.webp';
      joinRoom(joinRoomId, playerName, undefined, undefined, undefined, undefined, customAvatar);
    }
  };

  const handleConfirmJoin = () => {
    const customAvatar = '/assets/Es_line_sticker.webp';
    joinRoom(joinRoomId, playerName, joinPassword, undefined, undefined, undefined, customAvatar);
    setShowPasswordModal(false);
  };

  const handleSelectRoom = (roomId: string) => {
    setJoinRoomId(roomId);
    setActiveTab('join');
  };

  if (gameState) {
    return (
      <>
        <GameView />
      </>
    );
  }

  if (!isConnected) {
    return (
      <div className="connecting-container">
        <div className="connecting-text">CONNECTING</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative flex flex-col items-center justify-center gap-8 overflow-hidden">

      {/* Settings Menu Always Accessible */}
      <SettingsMenu />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <div className="text-center z-10">
        <h1 className="text-6xl sketch-title mb-2">
          SKETCH IT!
        </h1>
        <p className="font-hand text-ink font-bold opacity-90 text-xl">DRAW, GUESS, WIN!</p>
      </div>

      <div className="flex gap-8 z-10 items-start h-[550px]">
        {/* Left Column: Join/Create Tabs */}
        <div className="gartic-card w-80 flex flex-col h-full">
          {/* Tabs Header */}
          <div className="flex border-b-2 border-dashed border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 text-lg font-bold font-marker transition-colors ${activeTab === 'create' ? 'text-ink border-b-2 border-ink' : 'text-gray-400 hover:text-gray-600'}`}
            >
              CREATE
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-2 text-lg font-bold font-marker transition-colors ${activeTab === 'join' ? 'text-ink border-b-2 border-ink' : 'text-gray-400 hover:text-gray-600'}`}
            >
              JOIN
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-500 font-hand uppercase">Nickname</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="gartic-input"
                placeholder="Your Name"
              />
            </div>

            {activeTab === 'create' ? (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-500 font-hand uppercase">Room Name</label>
                  <input
                    type="text"
                    value={createRoomId}
                    onChange={(e) => setCreateRoomId(e.target.value)}
                    className="gartic-input"
                    placeholder="My Room"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-500 font-hand uppercase">Max Players: {maxPlayers}</label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-500 font-hand uppercase">Target Score: {maxScore}</label>
                  <select
                    value={maxScore}
                    onChange={(e) => setMaxScore(parseInt(e.target.value))}
                    className="gartic-input bg-transparent"
                  >
                    <option value="80">80</option>
                    <option value="120">120 (Standard)</option>
                    <option value="160">160</option>
                    <option value="200">200</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-500 font-hand uppercase">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="gartic-input bg-transparent"
                  >
                    <option value="general">General</option>
                    <option value="animals">Animals</option>
                    <option value="food">Food</option>
                    <option value="objects">Objects</option>
                    <option value="anime">Anime</option>
                    <option value="movies">Movies</option>
                    <option value="games">Games</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-500 font-hand uppercase">Password (Optional)</label>
                  <input
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="gartic-input"
                    placeholder="***"
                  />
                </div>
                <button onClick={handleCreate} className="gartic-btn mt-4 w-full py-3 text-xl" style={{ background: 'var(--color-pastel-green)' }}>
                  CREATE & PLAY
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-500 font-hand uppercase">Selected Room</label>
                  <input
                    type="text"
                    value={joinRoomId}
                    readOnly
                    className="gartic-input bg-gray-50 cursor-not-allowed text-gray-400"
                    placeholder="Select a room ->"
                  />
                </div>
                <button onClick={handleJoinClick} className="gartic-btn mt-4 w-full py-3 text-xl" style={{ background: 'var(--color-pastel-blue)' }}>
                  JOIN ROOM
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Room List */}
        <div className="gartic-card w-96 flex flex-col h-full">
          <div className="p-3 border-b-2 border-dashed border-gray-300 flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-500 font-hand">AVAILABLE ROOMS</span>
            <button onClick={getRooms} className="text-ink hover:rotate-180 transition-transform duration-500">
              <IconRefresh size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {rooms.length === 0 ? (
              <div className="text-center text-gray-400 font-hand text-lg mt-10">No rooms found. Create one!</div>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.roomId}
                  onClick={() => handleSelectRoom(room.roomId)}
                  className={`room-item ${joinRoomId === room.roomId ? 'selected' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-ink font-marker text-lg">{room.roomId}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-hand">
                        {room.gameStarted ? 'In Game' : 'Lobby'} • {room.playerCount}/{room.maxPlayers}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded font-hand text-gray-600 border border-gray-200 flex items-center gap-1">
                        {(() => {
                          const themeIcons: Record<string, React.ReactNode> = {
                            general: <IconPalette size={12} />,
                            animals: <IconPaw size={12} />,
                            food: <IconPizza size={12} />,
                            objects: <IconBox size={12} />,
                            anime: <IconStar size={12} />,
                            movies: <IconFilm size={12} />,
                            games: <IconGamepad size={12} />,
                            sports: <IconBall size={12} />
                          };
                          const icon = themeIcons[room.theme] || <IconPalette size={12} />;
                          const themeName = room.theme ? room.theme.charAt(0).toUpperCase() + room.theme.slice(1) : 'General';
                          return <>{icon} {themeName}</>;
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {room.isLocked && (
                      <IconLock size={16} className="text-gray-400" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-ink border border-ink ${joinRoomId === room.roomId ? 'bg-white' : 'bg-gray-200'}`}>
                      JOIN
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="sketch-modal w-80 animate-bounce-in">
            <h3 className="font-bold text-xl mb-4 text-ink font-marker text-center">Enter Password</h3>
            <input
              type="password"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              className="gartic-input mb-4 w-full"
              placeholder="Room Password"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="gartic-btn flex-1 py-2 text-sm bg-gray-200"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmJoin}
                className="gartic-btn flex-1 py-2 text-sm"
                style={{ background: 'var(--color-pastel-blue)' }}
              >
                JOIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
