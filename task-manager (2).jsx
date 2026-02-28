import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, ChevronDown, ChevronRight, Calendar, Edit2, Save, X, LogOut, User } from 'lucide-react';

export default function TaskManager() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginMode, setLoginMode] = useState('login'); // 'login' or 'register'
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMajor, setExpandedMajor] = useState({});
  const [expandedMedium, setExpandedMedium] = useState({});
  
  // Input states
  const [newMajorName, setNewMajorName] = useState('');
  const [newMediumName, setNewMediumName] = useState('');
  const [newMinorName, setNewMinorName] = useState('');
  const [newMinorDeadline, setNewMinorDeadline] = useState('');
  const [newMinorMemo, setNewMinorMemo] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('');
  const [showMajorInput, setShowMajorInput] = useState(false);
  const [showMediumInput, setShowMediumInput] = useState(false);
  const [showMinorInput, setShowMinorInput] = useState(false);
  
  // Edit states
  const [editingMajor, setEditingMajor] = useState(null);
  const [editingMedium, setEditingMedium] = useState(null);
  const [editingMinor, setEditingMinor] = useState(null);
  const [editMajorName, setEditMajorName] = useState('');
  const [editMediumName, setEditMediumName] = useState('');
  const [editMinorName, setEditMinorName] = useState('');
  const [editMinorDeadline, setEditMinorDeadline] = useState('');
  const [editMinorMemo, setEditMinorMemo] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load user data when user changes
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  // Save user data whenever categories change
  useEffect(() => {
    if (!isLoading && currentUser) {
      saveUserData();
    }
  }, [categories, isLoading, currentUser]);

  const checkSession = () => {
    try {
      const sessionData = localStorage.getItem('current-session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        setCurrentUser(session.userId);
      }
    } catch (error) {
      console.log('No active session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    if (!loginId.trim() || !loginPassword.trim()) {
      setLoginError('IDとパスワードを入力してください');
      return;
    }

    try {
      // Get user credentials
      const userKey = `user:${loginId}`;
      const userData = localStorage.getItem(userKey);
      
      if (!userData) {
        setLoginError('IDまたはパスワードが正しくありません');
        return;
      }

      const user = JSON.parse(userData);
      
      if (user.password !== loginPassword) {
        setLoginError('IDまたはパスワードが正しくありません');
        return;
      }

      // Create session
      localStorage.setItem('current-session', JSON.stringify({ userId: loginId }));
      setCurrentUser(loginId);
      setLoginError('');
      setLoginId('');
      setLoginPassword('');
    } catch (error) {
      setLoginError('IDまたはパスワードが正しくありません');
    }
  };

  const handleRegister = () => {
    if (!loginId.trim() || !loginPassword.trim()) {
      setLoginError('IDとパスワードを入力してください');
      return;
    }

    if (loginId.length < 3) {
      setLoginError('IDは3文字以上で入力してください');
      return;
    }

    if (loginPassword.length < 4) {
      setLoginError('パスワードは4文字以上で入力してください');
      return;
    }

    try {
      // Check if user already exists
      const userKey = `user:${loginId}`;
      const existingUser = localStorage.getItem(userKey);
      
      if (existingUser) {
        setLoginError('このIDは既に使用されています');
        return;
      }

      // Create new user
      const userData = {
        password: loginPassword,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(userKey, JSON.stringify(userData));
      
      // Create session
      localStorage.setItem('current-session', JSON.stringify({ userId: loginId }));
      setCurrentUser(loginId);
      setLoginError('');
      setLoginId('');
      setLoginPassword('');
    } catch (error) {
      console.error('Registration error:', error);
      setLoginError('登録に失敗しました: ' + error.message);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('current-session');
      setCurrentUser(null);
      setCategories([]);
      setIsLoading(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadUserData = () => {
    setIsLoading(true);
    try {
      const dataKey = `tasks:${currentUser}`;
      const data = localStorage.getItem(dataKey);
      if (data) {
        setCategories(JSON.parse(data));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log('No existing data for user');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = () => {
    try {
      const dataKey = `tasks:${currentUser}`;
      localStorage.setItem(dataKey, JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const addMajorCategory = () => {
    if (newMajorName.trim() === '') return;
    
    const newMajor = {
      id: Date.now().toString(),
      name: newMajorName,
      mediumCategories: []
    };
    
    setCategories([...categories, newMajor]);
    setNewMajorName('');
    setShowMajorInput(false);
    setExpandedMajor({ ...expandedMajor, [newMajor.id]: true });
  };

  const addMediumCategory = (majorId) => {
    if (newMediumName.trim() === '') return;
    
    const newMedium = {
      id: Date.now().toString(),
      name: newMediumName,
      minorTasks: []
    };
    
    setCategories(categories.map(major => 
      major.id === majorId 
        ? { ...major, mediumCategories: [...major.mediumCategories, newMedium] }
        : major
    ));
    
    setNewMediumName('');
    setShowMediumInput(false);
    setSelectedMajor('');
    setExpandedMedium({ ...expandedMedium, [newMedium.id]: true });
  };

  const addMinorTask = (majorId, mediumId) => {
    if (newMinorName.trim() === '') return;
    
    const newMinor = {
      id: Date.now().toString(),
      name: newMinorName,
      completed: false,
      deadline: newMinorDeadline || null,
      memo: newMinorMemo || '',
      createdAt: new Date().toISOString()
    };
    
    setCategories(categories.map(major => 
      major.id === majorId 
        ? {
            ...major,
            mediumCategories: major.mediumCategories.map(medium =>
              medium.id === mediumId
                ? { ...medium, minorTasks: [...medium.minorTasks, newMinor] }
                : medium
            )
          }
        : major
    ));
    
    setNewMinorName('');
    setNewMinorDeadline('');
    setNewMinorMemo('');
    setShowMinorInput(false);
    setSelectedMajor('');
    setSelectedMedium('');
  };

  const toggleMinorTask = (majorId, mediumId, minorId) => {
    setCategories(categories.map(major =>
      major.id === majorId
        ? {
            ...major,
            mediumCategories: major.mediumCategories.map(medium =>
              medium.id === mediumId
                ? {
                    ...medium,
                    minorTasks: medium.minorTasks.map(minor =>
                      minor.id === minorId
                        ? { ...minor, completed: !minor.completed }
                        : minor
                    )
                  }
                : medium
            )
          }
        : major
    ));
  };

  const startEditMajor = (major) => {
    setEditingMajor(major.id);
    setEditMajorName(major.name);
  };

  const saveEditMajor = (majorId) => {
    if (editMajorName.trim() === '') return;
    
    setCategories(categories.map(major =>
      major.id === majorId
        ? { ...major, name: editMajorName }
        : major
    ));
    
    setEditingMajor(null);
    setEditMajorName('');
  };

  const cancelEditMajor = () => {
    setEditingMajor(null);
    setEditMajorName('');
  };

  const startEditMedium = (medium) => {
    setEditingMedium(medium.id);
    setEditMediumName(medium.name);
  };

  const saveEditMedium = (majorId, mediumId) => {
    if (editMediumName.trim() === '') return;
    
    setCategories(categories.map(major =>
      major.id === majorId
        ? {
            ...major,
            mediumCategories: major.mediumCategories.map(medium =>
              medium.id === mediumId
                ? { ...medium, name: editMediumName }
                : medium
            )
          }
        : major
    ));
    
    setEditingMedium(null);
    setEditMediumName('');
  };

  const cancelEditMedium = () => {
    setEditingMedium(null);
    setEditMediumName('');
  };

  const startEditMinor = (minor) => {
    setEditingMinor(minor.id);
    setEditMinorName(minor.name);
    setEditMinorDeadline(minor.deadline || '');
    setEditMinorMemo(minor.memo || '');
  };

  const saveEditMinor = (majorId, mediumId, minorId) => {
    if (editMinorName.trim() === '') return;
    
    setCategories(categories.map(major =>
      major.id === majorId
        ? {
            ...major,
            mediumCategories: major.mediumCategories.map(medium =>
              medium.id === mediumId
                ? {
                    ...medium,
                    minorTasks: medium.minorTasks.map(minor =>
                      minor.id === minorId
                        ? { 
                            ...minor, 
                            name: editMinorName,
                            deadline: editMinorDeadline || null,
                            memo: editMinorMemo || ''
                          }
                        : minor
                    )
                  }
                : medium
            )
          }
        : major
    ));
    
    setEditingMinor(null);
    setEditMinorName('');
    setEditMinorDeadline('');
    setEditMinorMemo('');
  };

  const cancelEditMinor = () => {
    setEditingMinor(null);
    setEditMinorName('');
    setEditMinorDeadline('');
    setEditMinorMemo('');
  };

  const deleteMajor = (majorId) => {
    setCategories(categories.filter(major => major.id !== majorId));
  };

  const deleteMedium = (majorId, mediumId) => {
    setCategories(categories.map(major =>
      major.id === majorId
        ? {
            ...major,
            mediumCategories: major.mediumCategories.filter(medium => medium.id !== mediumId)
          }
        : major
    ));
  };

  const deleteMinor = (majorId, mediumId, minorId) => {
    setCategories(categories.map(major =>
      major.id === majorId
        ? {
            ...major,
            mediumCategories: major.mediumCategories.map(medium =>
              medium.id === mediumId
                ? {
                    ...medium,
                    minorTasks: medium.minorTasks.filter(minor => minor.id !== minorId)
                  }
                : medium
            )
          }
        : major
    ));
  };

  const toggleMajor = (majorId) => {
    setExpandedMajor({ ...expandedMajor, [majorId]: !expandedMajor[majorId] });
  };

  const toggleMedium = (mediumId) => {
    setExpandedMedium({ ...expandedMedium, [mediumId]: !expandedMedium[mediumId] });
  };

  const getTaskStats = () => {
    let total = 0;
    let completed = 0;
    
    categories.forEach(major => {
      major.mediumCategories.forEach(medium => {
        medium.minorTasks.forEach(minor => {
          total++;
          if (minor.completed) completed++;
        });
      });
    });
    
    return { total, completed };
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const date = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';
    if (diffDays < 0) return `${Math.abs(diffDays)}日前`;
    if (diffDays < 7) return `${diffDays}日後`;
    
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  const stats = getTaskStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-green-700 text-lg font-semibold">読み込み中...</div>
      </div>
    );
  }

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center py-8 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-t-4 border-green-700">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-700 rounded-full mb-4 shadow-lg">
              <User size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-green-800 mb-2 tracking-tight" style={{fontFamily: 'serif'}}>Task kanri banzai</h1>
            <p className="text-green-700 text-base font-medium">
              {loginMode === 'login' ? 'ログインしてください' : '新規アカウント登録'}
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-green-800 mb-2">
                ユーザーID
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (loginMode === 'login' ? handleLogin() : handleRegister())}
                placeholder="ユーザーIDを入力"
                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-800 placeholder-gray-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-green-800 mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (loginMode === 'login' ? handleLogin() : handleRegister())}
                placeholder="パスワードを入力"
                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
            </div>

            {loginMode === 'login' ? (
              <>
                <button
                  onClick={handleLogin}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  ログイン
                </button>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setLoginMode('register');
                      setLoginError('');
                    }}
                    className="text-green-700 hover:text-green-900 text-sm font-semibold underline"
                  >
                    アカウントをお持ちでない方はこちら
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleRegister}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  新規登録
                </button>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setLoginMode('login');
                      setLoginError('');
                    }}
                    className="text-green-700 hover:text-green-900 text-sm font-semibold underline"
                  >
                    既にアカウントをお持ちの方はこちら
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-green-200">
            <p className="text-xs text-gray-500 text-center">
              {loginMode === 'register' && 'ID: 3文字以上 / パスワード: 4文字以上'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Task Manager (after login)
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
            <h1 className="text-5xl font-bold text-green-800 tracking-tight" style={{fontFamily: 'serif'}}>Task kanri banzai</h1>
            <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-lg border border-green-200">
              <User size={18} className="text-green-700" />
              <span className="text-sm font-bold text-green-800">{currentUser}</span>
              <button
                onClick={handleLogout}
                className="ml-2 text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                title="ログアウト"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <p className="text-green-700 text-lg font-medium">
            {stats.total > 0 ? `${stats.completed} / ${stats.total} 完了` : '大項目を追加してください'}
          </p>
        </div>

        {/* Add Major Category Button */}
        <div className="mb-6">
          {!showMajorInput ? (
            <button
              onClick={() => setShowMajorInput(true)}
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-bold text-base"
            >
              <Plus size={20} />
              大項目を追加
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-5 border border-green-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMajorName}
                  onChange={(e) => setNewMajorName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMajorCategory()}
                  placeholder="大項目名を入力..."
                  className="flex-1 px-4 py-3 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-800 placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={addMajorCategory}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full transition-colors font-bold"
                >
                  追加
                </button>
                <button
                  onClick={() => {
                    setShowMajorInput(false);
                    setNewMajorName('');
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full transition-colors font-semibold"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-gray-600 text-base border border-green-100">
              大項目がありません。上のボタンから追加してください。
            </div>
          ) : (
            categories.map(major => (
              <div key={major.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                {/* Major Category Header */}
                <div className="bg-green-700 p-4 flex items-center gap-2">
                  <button
                    onClick={() => toggleMajor(major.id)}
                    className="text-white hover:text-green-100"
                  >
                    {expandedMajor[major.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  
                  {editingMajor === major.id ? (
                    <>
                      <input
                        type="text"
                        value={editMajorName}
                        onChange={(e) => setEditMajorName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditMajor(major.id)}
                        className="flex-1 px-3 py-2 bg-white border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEditMajor(major.id)}
                        className="text-white hover:text-green-100 p-2 hover:bg-green-800 rounded-lg transition-colors"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={cancelEditMajor}
                        className="text-white hover:text-green-100 p-2 hover:bg-green-800 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="flex-1 text-xl font-bold text-white">{major.name}</h2>
                      <button
                        onClick={() => startEditMajor(major)}
                        className="text-white hover:text-green-100 p-2 hover:bg-green-800 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMajor(major.id);
                          setShowMediumInput(true);
                        }}
                        className="text-white hover:text-green-100 text-sm px-4 py-2 hover:bg-green-800 rounded-full transition-colors font-bold"
                      >
                        + 中項目
                      </button>
                      <button
                        onClick={() => deleteMajor(major.id)}
                        className="text-white hover:text-red-200 p-2 hover:bg-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>

                {/* Medium Categories */}
                {expandedMajor[major.id] && (
                  <div className="p-5 space-y-3 bg-green-50/30">
                    {/* Add Medium Input */}
                    {showMediumInput && selectedMajor === major.id && (
                      <div className="bg-white border-2 border-green-300 rounded-xl p-4 mb-3 shadow-md">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMediumName}
                            onChange={(e) => setNewMediumName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addMediumCategory(major.id)}
                            placeholder="中項目名を入力..."
                            className="flex-1 px-4 py-2 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 placeholder-gray-400"
                            autoFocus
                          />
                          <button
                            onClick={() => addMediumCategory(major.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition-colors font-bold"
                          >
                            追加
                          </button>
                          <button
                            onClick={() => {
                              setShowMediumInput(false);
                              setSelectedMajor('');
                              setNewMediumName('');
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full transition-colors font-semibold"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    )}

                    {major.mediumCategories.length === 0 ? (
                      <div className="text-gray-500 text-sm text-center py-3">
                        中項目がありません
                      </div>
                    ) : (
                      major.mediumCategories.map(medium => (
                        <div key={medium.id} className="border-2 border-green-200 rounded-xl overflow-hidden bg-white shadow-md">
                          {/* Medium Category Header */}
                          <div className="bg-green-600 p-3 flex items-center gap-2">
                            <button
                              onClick={() => toggleMedium(medium.id)}
                              className="text-white hover:text-green-100"
                            >
                              {expandedMedium[medium.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            
                            {editingMedium === medium.id ? (
                              <>
                                <input
                                  type="text"
                                  value={editMediumName}
                                  onChange={(e) => setEditMediumName(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && saveEditMedium(major.id, medium.id)}
                                  className="flex-1 px-3 py-1 bg-white border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveEditMedium(major.id, medium.id)}
                                  className="text-white hover:text-green-100 p-1 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                  <Save size={16} />
                                </button>
                                <button
                                  onClick={cancelEditMedium}
                                  className="text-white hover:text-green-100 p-1 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <h3 className="flex-1 font-bold text-white text-base">{medium.name}</h3>
                                <button
                                  onClick={() => startEditMedium(medium)}
                                  className="text-white hover:text-green-100 p-1 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMajor(major.id);
                                    setSelectedMedium(medium.id);
                                    setShowMinorInput(true);
                                  }}
                                  className="text-white hover:text-green-100 text-sm px-3 py-1 hover:bg-green-700 rounded-full transition-colors font-bold"
                                >
                                  + 小項目
                                </button>
                                <button
                                  onClick={() => deleteMedium(major.id, medium.id)}
                                  className="text-white hover:text-red-200 p-1 hover:bg-red-600 rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>

                          {/* Minor Tasks */}
                          {expandedMedium[medium.id] && (
                            <div className="p-4 space-y-2 bg-green-50/50">
                              {/* Add Minor Input */}
                              {showMinorInput && selectedMajor === major.id && selectedMedium === medium.id && (
                                <div className="bg-white border-2 border-green-300 rounded-xl p-4 mb-3 shadow-md">
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={newMinorName}
                                      onChange={(e) => setNewMinorName(e.target.value)}
                                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addMinorTask(major.id, medium.id)}
                                      placeholder="小項目名を入力..."
                                      className="w-full px-4 py-2 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 placeholder-gray-400"
                                      autoFocus
                                    />
                                    <div className="flex gap-2 items-center">
                                      <Calendar size={16} className="text-green-700" />
                                      <input
                                        type="date"
                                        value={newMinorDeadline}
                                        onChange={(e) => setNewMinorDeadline(e.target.value)}
                                        className="flex-1 px-4 py-2 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                                      />
                                    </div>
                                    <textarea
                                      value={newMinorMemo}
                                      onChange={(e) => setNewMinorMemo(e.target.value)}
                                      placeholder="メモ（任意）"
                                      className="w-full px-4 py-2 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none text-gray-800 placeholder-gray-400"
                                      rows={2}
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => addMinorTask(major.id, medium.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition-colors font-bold"
                                      >
                                        追加
                                      </button>
                                      <button
                                        onClick={() => {
                                          setShowMinorInput(false);
                                          setSelectedMajor('');
                                          setSelectedMedium('');
                                          setNewMinorName('');
                                          setNewMinorDeadline('');
                                          setNewMinorMemo('');
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full transition-colors font-semibold"
                                      >
                                        キャンセル
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {medium.minorTasks.length === 0 ? (
                                <div className="text-gray-500 text-sm text-center py-3">
                                  小項目がありません
                                </div>
                              ) : (
                                medium.minorTasks.map(minor => (
                                  <div key={minor.id}>
                                    {editingMinor === minor.id ? (
                                      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-2 shadow-md">
                                        <input
                                          type="text"
                                          value={editMinorName}
                                          onChange={(e) => setEditMinorName(e.target.value)}
                                          className="w-full px-4 py-2 bg-white border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
                                          autoFocus
                                        />
                                        <div className="flex gap-2 items-center">
                                          <Calendar size={16} className="text-amber-700" />
                                          <input
                                            type="date"
                                            value={editMinorDeadline}
                                            onChange={(e) => setEditMinorDeadline(e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
                                          />
                                        </div>
                                        <textarea
                                          value={editMinorMemo}
                                          onChange={(e) => setEditMinorMemo(e.target.value)}
                                          placeholder="メモ（任意）"
                                          className="w-full px-4 py-2 bg-white border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-gray-800 placeholder-gray-400"
                                          rows={2}
                                        />
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => saveEditMinor(major.id, medium.id, minor.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition-colors flex items-center gap-1 font-bold"
                                          >
                                            <Save size={16} />
                                            保存
                                          </button>
                                          <button
                                            onClick={cancelEditMinor}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full transition-colors flex items-center gap-1 font-semibold"
                                          >
                                            <X size={16} />
                                            キャンセル
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg transition-colors">
                                          <button
                                            onClick={() => toggleMinorTask(major.id, medium.id, minor.id)}
                                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                              minor.completed
                                                ? 'bg-green-600 border-green-600'
                                                : 'border-green-400 hover:border-green-600'
                                            }`}
                                          >
                                            {minor.completed && <Check size={14} className="text-white" />}
                                          </button>
                                          
                                          <span
                                            className={`flex-1 text-sm ${
                                              minor.completed
                                                ? 'line-through text-gray-400'
                                                : 'text-gray-700 font-medium'
                                            }`}
                                          >
                                            {minor.name}
                                          </span>
                                          
                                          {minor.deadline && (
                                            <span
                                              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                                minor.completed
                                                  ? 'bg-gray-100 text-gray-400'
                                                  : isOverdue(minor.deadline) && !minor.completed
                                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                                  : 'bg-blue-100 text-blue-700 border border-blue-300'
                                              }`}
                                            >
                                              {formatDeadline(minor.deadline)}
                                            </span>
                                          )}
                                          
                                          <button
                                            onClick={() => startEditMinor(minor)}
                                            className="flex-shrink-0 text-green-600 hover:text-green-700 p-1 hover:bg-green-100 rounded-lg transition-colors"
                                          >
                                            <Edit2 size={14} />
                                          </button>
                                          
                                          <button
                                            onClick={() => deleteMinor(major.id, medium.id, minor.id)}
                                            className="flex-shrink-0 text-red-600 hover:text-red-700 p-1 hover:bg-red-100 rounded-lg transition-colors"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                        
                                        {minor.memo && (
                                          <div className="ml-7 mr-2 text-xs text-gray-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                                            {minor.memo}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {stats.total > 0 && (
          <div className="mt-6 text-center text-base text-green-700 font-semibold">
            残り: {stats.total - stats.completed} タスク
          </div>
        )}
      </div>
    </div>
  );
}
