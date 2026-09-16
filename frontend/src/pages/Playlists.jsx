import React from 'react';
import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function totalDuration(songs) {
  const total = songs.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h} hr ${m} min`;
  return `${m} min`;
}


function PlaylistCard({ playlist, onClick, onDelete }) {
  return (
    <div
      onClick={onClick}
      className='group relative flex flex-col gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-[#ff7a00]/60 hover:bg-zinc-800/60 transition-colors cursor-pointer'
    >
      <div className='relative w-full aspect-square rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden'>
        {playlist.cover_url ? (
          <img src={playlist.cover_url} alt='' className='w-full h-full object-cover' />
        ) : (
          <i className='fa-solid fa-music text-zinc-600 text-4xl'></i>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}
          className='absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-zinc-300 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:text-red-400 transition-opacity'
          title='Delete playlist'
        >
          <i className='fa-solid fa-trash text-sm'></i>
        </button>
      </div>
      <div className='flex flex-col gap-0.5'>
        <p className='text-white font-semibold truncate'>{playlist.name}</p>
        <p className='text-zinc-500 text-sm'>{playlist.song_count ?? 0} songs</p>
      </div>
    </div>
  );
}


function PlaylistSongRow({ song, index, onPlay, onRemove }) {
  return (
    <div className='group grid grid-cols-[2rem_1fr_auto_auto] items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-zinc-900 transition-colors'>
      <span className='text-zinc-500 text-sm text-center group-hover:hidden'>{index + 1}</span>
      <button
        onClick={onPlay}
        className='hidden group-hover:flex items-center justify-center text-white'
      >
        <i className='fa-solid fa-play text-sm'></i>
      </button>

      <div className='flex flex-col min-w-0'>
        <p className='text-white text-sm font-medium truncate'>{song.title}</p>
        <p className='text-zinc-500 text-xs truncate'>{song.artist || 'Unknown artist'}</p>
      </div>

      <span className='text-zinc-500 text-sm tabular-nums'>
        {formatDuration(song.duration_seconds)}
      </span>

      <button
        onClick={onRemove}
        className='text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity'
        title='Remove from playlist'
      >
        <i className='fa-solid fa-xmark'></i>
      </button>
    </div>
  );
}


function AddSongsModal({ token, existingIds, onAdd, onClose }) {
  const [allSongs, setAllSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`${API_URL}/songs/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllSongs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching songs for modal:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [token]);

  const filtered = allSongs.filter((song) => {
    const q = search.toLowerCase().trim();
    return song.title?.toLowerCase().includes(q) || song.artist?.toLowerCase().includes(q);
  });

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
      <div className='w-full max-w-lg max-h-[80vh] bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b border-zinc-800'>
          <h3 className='text-white text-lg font-semibold'>Add songs</h3>
          <button onClick={onClose} className='text-zinc-500 hover:text-white'>
            <i className='fa-solid fa-xmark text-lg'></i>
          </button>
        </div>

        <div className='p-4'>
          <div className='relative'>
            <i className='fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm'></i>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type='text'
              placeholder='Search your songs...'
              className='w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#ff7a00] text-white rounded-xl outline-none placeholder:text-zinc-500 text-sm transition-colors'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto no-scrollbar px-2 pb-4'>
          {loading && <p className='text-zinc-500 text-sm px-3'>Loading songs...</p>}
          {!loading && filtered.length === 0 && (
            <p className='text-zinc-500 text-sm px-3'>No songs found.</p>
          )}
          {filtered.map((song) => {
            const already = existingIds.has(song.id);
            return (
              <div
                key={song.id}
                className='flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-900 transition-colors'
              >
                <div className='flex flex-col min-w-0'>
                  <p className='text-white text-sm font-medium truncate'>{song.title}</p>
                  <p className='text-zinc-500 text-xs truncate'>{song.artist || 'Unknown artist'}</p>
                </div>
                <button
                  onClick={() => onAdd(song.id)}
                  disabled={already}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    already
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-[#ff7a00] text-black hover:bg-[#ff8f1f]'
                  }`}
                >
                  <i className={`fa-solid ${already ? 'fa-check' : 'fa-plus'} text-xs`}></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function PlaylistDetail({ playlist, token, onBack, onPlaySong, onPlaylistUpdated, onPlaylistDeleted }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(playlist.name);

  const fetchSongs = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/playlists/${playlist.id}/songs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    setSongs(list);
    return list;
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    setSongs([]);
    return [];
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSongs();
  }, [playlist.id]);

  const handleAddSong = async (songId) => {
  try {
    const res = await fetch(`${API_URL}/playlists/${playlist.id}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ song_id: songId }),
    });
    if (res.ok) {
      const updatedList = await fetchSongs();
      onPlaylistUpdated({ ...playlist, song_count: updatedList.length });
    } else {
      console.error('Failed to add song, status:', res.status);
    }
  } catch (error) {
    console.error('Error adding song:', error);
  }
};

  const handleRemoveSong = async (songId) => {
  try {
    const res = await fetch(`${API_URL}/playlists/${playlist.id}/songs/${songId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSongs((prev) => {
        const next = prev.filter((s) => s.id !== songId);
        onPlaylistUpdated({ ...playlist, song_count: next.length });
        return next;
      });
    }
  } catch (error) {
    console.error('Error removing song:', error);
  }
};

  const handleRename = async () => {
    setEditingName(false);
    if (!nameDraft.trim() || nameDraft === playlist.name) {
      setNameDraft(playlist.name);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/playlists/${playlist.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameDraft.trim() }),
      });
      if (res.ok) {
        const updated = await res.json();
        onPlaylistUpdated(updated);
      }
    } catch (error) {
      console.error('Error renaming playlist:', error);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      const res = await fetch(`${API_URL}/playlists/${playlist.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onPlaylistDeleted(playlist.id);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const existingIds = new Set(songs.map((s) => s.id));

  return (
    <div className='flex flex-col gap-6 sm:gap-8 p-2 max-w-7xl mx-auto w-full pb-36'>
      <button
        onClick={onBack}
        className='flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-fit text-sm'
      >
        <i className='fa-solid fa-arrow-left'></i>
        Playlists
      </button>

      <div className='flex flex-col sm:flex-row gap-6 sm:items-end'>
        <div className='w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center'>
          <i className='fa-solid fa-music text-zinc-600 text-5xl'></i>
        </div>

        <div className='flex flex-col gap-3 min-w-0'>
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className='text-white text-3xl sm:text-5xl font-medium tracking-tight bg-transparent border-b border-[#ff7a00] outline-none'
            />
          ) : (
            <h2
              onClick={() => setEditingName(true)}
              className='text-white text-3xl sm:text-5xl font-medium tracking-tight cursor-text truncate'
              title='Click to rename'
            >
              {playlist.name}
            </h2>
          )}
          <p className='text-zinc-500 text-sm'>
            {songs.length} songs{songs.length > 0 && ` · ${totalDuration(songs)}`}
          </p>

          <div className='flex items-center gap-3 mt-2'>
            <button
              onClick={() => songs.length > 0 && onPlaySong(songs[0], songs)}
              disabled={songs.length === 0}
              className='flex items-center gap-2 px-5 py-2.5 bg-[#ff7a00] text-black font-semibold rounded-full hover:bg-[#ff8f1f] disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors text-sm'
            >
              <i className='fa-solid fa-play'></i>
              Play
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className='flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-full hover:border-[#ff7a00]/60 transition-colors text-sm'
            >
              <i className='fa-solid fa-plus'></i>
              Add songs
            </button>
            <button
              onClick={handleDeletePlaylist}
              className='flex items-center gap-2 px-4 py-2.5 text-zinc-500 hover:text-red-400 transition-colors text-sm'
            >
              <i className='fa-solid fa-trash'></i>
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-1 border-t border-zinc-800/60 pt-4'>
        {loading && <p className='text-zinc-500 text-sm px-3'>Loading songs...</p>}

        {!loading && songs.length === 0 && (
          <div className='flex flex-col items-center gap-3 py-16 text-center'>
            <i className='fa-solid fa-headset text-zinc-700 text-4xl'></i>
            <p className='text-zinc-500'>This playlist is empty</p>
            <button
              onClick={() => setShowAddModal(true)}
              className='mt-1 px-5 py-2 bg-[#ff7a00] text-black font-semibold rounded-full hover:bg-[#ff8f1f] transition-colors text-sm'
            >
              Add songs
            </button>
          </div>
        )}

        {songs.map((song, i) => (
          <PlaylistSongRow
            key={song.id}
            song={song}
            index={i}
            onPlay={() => onPlaySong(song, songs)}
            onRemove={() => handleRemoveSong(song.id)}
          />
        ))}
      </div>

      {showAddModal && (
        <AddSongsModal
          token={token}
          existingIds={existingIds}
          onAdd={handleAddSong}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}


function Playlists({ userId, token, onPlaySong }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`${API_URL}/playlists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlaylists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchPlaylists();
    // 
  }, [userId, token]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreating(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setPlaylists((prev) => [created, ...prev]);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setNewName('');
      setCreating(false);
    }
  };

  const handleDelete = async (playlistId) => {
    try {
      const res = await fetch(`${API_URL}/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handlePlaylistUpdated = (updated) => {
    setPlaylists((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
    setSelectedPlaylist((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  const handlePlaylistDeleted = (playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    setSelectedPlaylist(null);
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase().trim())
  );

  if (selectedPlaylist) {
    return (
      <PlaylistDetail
        playlist={selectedPlaylist}
        token={token}
        onBack={() => setSelectedPlaylist(null)}
        onPlaySong={onPlaySong}
        onPlaylistUpdated={handlePlaylistUpdated}
        onPlaylistDeleted={handlePlaylistDeleted}
      />
    );
  }

  return (
    <div className='flex flex-col gap-6 sm:gap-8 p-2 max-w-7xl mx-auto w-full pb-36'>
      {/* Search Bar */}
      <div className='relative w-full max-w-xl'>
        <i className='fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg'></i>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type='text'
          placeholder='Search playlists...'
          className='w-full pl-13 pr-5 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-[#ff7a00] text-white rounded-2xl outline-none placeholder:text-zinc-500 transition-colors text-base'
        />
      </div>

      {/* Page Title */}
      <div className='flex items-center justify-between'>
        <h2 className='text-white text-3xl sm:text-5xl font-medium tracking-tight'>Playlists</h2>

        {creating ? (
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleCreate}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder='Playlist name'
            className='px-4 py-2 bg-zinc-900 border border-[#ff7a00] text-white rounded-full outline-none placeholder:text-zinc-500 text-sm w-48'
          />
        ) : (
          <button
            onClick={() => setCreating(true)}
            className='flex items-center gap-2 px-5 py-2.5 bg-[#ff7a00] text-black font-semibold rounded-full hover:bg-[#ff8f1f] transition-colors text-sm shrink-0'
          >
            <i className='fa-solid fa-plus'></i>
            New playlist
          </button>
        )}
      </div>

      {/* Section Header */}
      <div className='flex flex-row items-center justify-between border-b border-zinc-800/60 pb-3'>
        <h3 className='text-zinc-200 text-xl sm:text-2xl font-semibold'>Your playlists</h3>
        <span className='text-zinc-500 text-sm font-medium'>{playlists.length} playlists</span>
      </div>

      {/* Playlist Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {loading && <p className='text-zinc-500 text-sm'>Loading playlists...</p>}

        {!loading &&
          filteredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onClick={() => setSelectedPlaylist(playlist)}
              onDelete={handleDelete}
            />
          ))}

        {!loading && filteredPlaylists.length === 0 && playlists.length > 0 && (
          <p className='col-span-full flex gap-3 text-zinc-500 text-2xl mt-2'>
            <i className='fa-solid fa-headset text-zinc-400 text-4xl'></i>
            No playlists found matching your search
          </p>
        )}

        {!loading && playlists.length === 0 && (
          <div className='col-span-full flex flex-col items-center gap-3 py-16 text-center'>
            <i className='fa-solid fa-headset text-zinc-700 text-5xl'></i>
            <p className='text-zinc-500 text-lg'>You haven't made any playlists yet</p>
            <button
              onClick={() => setCreating(true)}
              className='mt-1 px-5 py-2.5 bg-[#ff7a00] text-black font-semibold rounded-full hover:bg-[#ff8f1f] transition-colors text-sm'
            >
              Create your first playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlists;