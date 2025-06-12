import React, { useState, useEffect } from 'react';
import { Search, Users, TrendingUp, Activity, AlertCircle, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function GigaYapsDashboard() {
  const [users, setUsers] = useState([
    { id: 1, username: 'elonmusk', user_id: '', yapsScore: null, loading: false, error: null },
    { id: 2, username: 'vitalikbuterin', user_id: '', yapsScore: null, loading: false, error: null }
  ]);
  const [newUsername, setNewUsername] = useState('');
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0
  });

  // REAL API call function - replace the simulated one above with this
  const fetchYapsScoreReal = async (username, user_id = '') => {
    const apiUrl = 'https://api.kaito.ai/yaps/user';
    const params = new URLSearchParams();
    
    if (user_id) {
      params.append('user_id', user_id);
    } else if (username) {
      params.append('username', username);
    }

    try {
      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add API key if required by Kaito
          // 'Authorization': 'Bearer YOUR_API_KEY_HERE',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          username: data.username || username,
          user_id: data.user_id || user_id,
          yaps_score: data.yaps_score,
          last_updated: data.last_updated || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('API call failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Simulated API call function (replace with fetchYapsScoreReal above)
  const fetchYapsScore = async (username, user_id = '') => {
    const apiUrl = 'https://api.kaito.ai/yaps/user';
    const params = new URLSearchParams();
    
    if (user_id) {
      params.append('user_id', user_id);
    } else if (username) {
      params.append('username', username);
    }

    try {
      // Simulated response - replace with actual API call
      const simulatedScore = Math.floor(Math.random() * 1000) + 100;
      
      return {
        success: true,
        data: {
          username: username,
          user_id: user_id || `${Date.now()}`,
          yaps_score: simulatedScore,
          last_updated: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const updateUserScore = async (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, loading: true, error: null } : user
    ));

    const user = users.find(u => u.id === userId);
    const result = await fetchYapsScore(user.username, user.user_id);

    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === userId ? {
          ...u,
          loading: false,
          yapsScore: result.success ? result.data.yaps_score : null,
          error: result.success ? null : result.error
        } : u
      ));
    }, 1000);
  };

  const addUser = async () => {
    if (!newUsername.trim()) return;

    const newUser = {
      id: Date.now(),
      username: newUsername.trim(),
      user_id: '',
      yapsScore: null,
      loading: true,
      error: null
    };

    setUsers(prev => [...prev, newUser]);
    setNewUsername('');

    const result = await fetchYapsScore(newUser.username);
    
    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === newUser.id ? {
          ...u,
          loading: false,
          yapsScore: result.success ? result.data.yaps_score : null,
          error: result.success ? null : result.error
        } : u
      ));
    }, 1000);
  };

  const removeUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const refreshAllUsers = () => {
    users.forEach(user => {
      if (user.yapsScore !== null) {
        updateUserScore(user.id);
      }
    });
  };

  useEffect(() => {
    const validScores = users.filter(u => u.yapsScore !== null).map(u => u.yapsScore);
    
    setGlobalStats({
      totalUsers: users.length,
      averageScore: validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0,
      highestScore: validScores.length > 0 ? Math.max(...validScores) : 0,
      lowestScore: validScores.length > 0 ? Math.min(...validScores) : 0
    });
  }, [users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">GigaYaps Dashboard</h1>
          <p className="text-gray-600">Track and monitor user attention scores via the Kaito API</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-blue-500" />
            How This API Works
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">API Endpoint:</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">https://api.kaito.ai/yaps/user</code>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Rate Limit:</h3>
              <span className="text-gray-600">100 calls every 5 minutes</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Parameters:</h3>
              <span className="text-gray-600">username (X handle) or user_id</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Response:</h3>
              <span className="text-gray-600">JSON with Yaps score data</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.averageScore}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Highest Score</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.highestScore}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lowest Score</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.lowestScore}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter X username (e.g., elonmusk)"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addUser()}
              />
            </div>
            <button
              onClick={addUser}
              disabled={!newUsername.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Tracked Users</h2>
            <button
              onClick={refreshAllUsers}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh All
            </button>
          </div>
          
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">@{user.username}</h3>
                      <p className="text-sm text-gray-600">
                        {user.loading ? 'Loading...' : 
                         user.error ? 'Error loading data' :
                         user.yapsScore !== null ? `Yaps Score: ${user.yapsScore}` : 'No data'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {user.loading && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    )}
                    {user.error && (
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    )}
                    <button
                      onClick={() => updateUserScore(user.id)}
                      disabled={user.loading}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => removeUser(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {user.yapsScore !== null && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((user.yapsScore / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users added yet. Add a user above to get started!</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>This dashboard demonstrates how to use the Kaito Yaps API to track user attention scores.</p>
          <p>Replace fetchYapsScore with fetchYapsScoreReal function to connect to live API.</p>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
          max-width: 1200px;
        }
        
        .bg-gradient-to-br {
          background: linear-gradient(to bottom right, #dbeafe, #e0e7ff);
        }
        
        .from-blue-50 { --tw-gradient-from: #eff6ff; }
        .to-indigo-100 { --tw-gradient-to: #e0e7ff; }
        .from-blue-400 { --tw-gradient-from: #60a5fa; }
        .to-purple-500 { --tw-gradient-to: #a855f7; }
        .from-blue-500 { --tw-gradient-from: #3b82f6; }
        
        .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        
        .text-gray-800 { color: #1f2937; }
        .text-gray-700 { color: #374151; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-500 { color: #6b7280; }
        .text-gray-900 { color: #111827; }
        .text-white { color: #ffffff; }
        .text-blue-500 { color: #3b82f6; }
        .text-green-500 { color: #10b981; }
        .text-purple-500 { color: #a855f7; }
        .text-orange-500 { color: #f97316; }
        .text-red-500 { color: #ef4444; }
        
        .bg-white { background-color: #ffffff; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-gray-200 { background-color: #e5e7eb; }
        .bg-gray-300 { background-color: #d1d5db; }
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-green-500 { background-color: #10b981; }
        .bg-red-500 { background-color: #ef4444; }
        
        .hover\\:bg-blue-600:hover { background-color: #2563eb; }
        .hover\\:bg-green-600:hover { background-color: #059669; }
        .hover\\:bg-red-600:hover { background-color: #dc2626; }
        .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
        
        .border { border-width: 1px; }
        .border-gray-200 { border-color: #e5e7eb; }
        .border-gray-300 { border-color: #d1d5db; }
        
        .rounded { border-radius: 0.25rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        
        .p-1 { padding: 0.25rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        
        .m-0 { margin: 0; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mr-2 { margin-right: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .mt-8 { margin-top: 2rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        
        .min-h-screen { min-height: 100vh; }
        .w-full { width: 100%; }
        .w-12 { width: 3rem; }
        .h-2 { height: 0.5rem; }
        .h-4 { height: 1rem; }
        .h-6 { height: 1.5rem; }
        .h-8 { height: 2rem; }
        .h-12 { height: 3rem; }
        
        .flex { display: flex; }
        .flex-1 { flex: 1 1 0%; }
        .grid { display: grid; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .text-center { text-align: center; }
        .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; }
        .space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; }
        .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        
        @media (min-width: 768px) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        
        .transition-colors { transition-property: color, background-color, border-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .duration-500 { transition-duration: 500ms; }
        
        .focus\\:ring-2:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
        .focus\\:border-transparent:focus { border-color: transparent; }
        
        .disabled\\:bg-gray-300:disabled { background-color: #d1d5db; }
        
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .opacity-50 { opacity: 0.5; }
      `}</style>
    </div>
  );
}