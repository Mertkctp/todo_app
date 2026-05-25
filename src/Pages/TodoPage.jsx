import { useState, useEffect } from 'react';
import TodoItem from '../Components/TodoItem';
import { ITodo } from '../Interfaces/Todo'; 

function TodoPage() {
  // --- STATE TANIMLAMALARI ---
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('my_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState(() => localStorage.getItem('my_personal_notes') || "");
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dark_mode') !== 'false');

  // Pomodoro States
  const [sessions, setSessions] = useState(1);
  const [currentSession, setCurrentSession] = useState(1);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Motivasyon Sözü State
  const [quote] = useState(() => {
    const quotes = [
      "Başlamak için mükemmel olmana gerek yok, ama mükemmel olmak için başlaman gerek.",
      "Bugün yapacağın küçük bir adım, yarınki dev başarın olabilir.",
      "Disiplin, hedefler ile başarı arasındaki köprüdür.",
      "Zorluklar, başarıyı daha tatlı kılar. Vazgeçme!",
      "Yarınki sen, bugün pes etmediğin için sana teşekkür edecek."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  // --- LOCAL STORAGE KAYIT ---
  useEffect(() => { localStorage.setItem('my_todos', JSON.stringify(todos)); }, [todos]);
  useEffect(() => { localStorage.setItem('my_personal_notes', notes); }, [notes]);
  useEffect(() => { localStorage.setItem('dark_mode', darkMode); }, [darkMode]);

  // --- POMODORO ---
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      if (currentSession < sessions) {
        setCurrentSession(prev => prev + 1);
        setTimeLeft(25 * 60);
        alert(`${currentSession}. Tur Bitti! Bir sonrakine hazır mısın?`);
      } else {
        setIsActive(false);
        setCurrentSession(1);
        setTimeLeft(25 * 60);
        alert("Tebrikler! Tüm çalışma turları tamamlandı.");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentSession, sessions]);

  // --- FONKSİYONLAR ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

   
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      date: selectedDate,
      completed: false
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const progressPercentage = todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0;
  
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className={`min-h-screen py-10 px-4 transition-colors duration-500 ${darkMode ? 'bg-[#121826] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* Üst Bar: Aydınlık/Karanlık Mod */}
      <div className="max-w-6xl mx-auto flex justify-end mb-6">
        <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all shadow-sm ${darkMode ? 'bg-[#1f2937] border-gray-700 text-orange-400' : 'bg-white border-gray-200 text-gray-600'}`}>
          {darkMode ? '☀️ AYDINLIK' : '🌙 KARANLIK'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL SÜTUN: GÖREV TAKVİMİ */}
        <div className={`lg:col-span-8 p-8 rounded-[2rem] shadow-2xl border ${darkMode ? 'bg-[#1f2937] border-gray-700' : 'bg-white border-gray-100'}`}>
          <h1 className="text-2xl font-black mb-1 tracking-tight text-indigo-400 uppercase">Görev Takvimi</h1>
          <p className="text-[10px] mb-8 italic opacity-60 font-medium tracking-wide">
            "{quote}"
          </p>
          
          <div className="mb-8">
            <div className="flex justify-between text-[10px] font-black uppercase opacity-40 mb-2">
              <span>Tamamlanma</span>
              <span>%{progressPercentage}</span>
            </div>
            <div className={`h-1.5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'}`}>
              <div style={{ width: `${progressPercentage}%` }} className="h-full bg-indigo-500 rounded-full transition-all duration-1000"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
            <input 
              type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Yeni bir görev odakla..."
              className={`flex-[3] p-3 rounded-xl border-none text-sm focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#121826]' : 'bg-gray-100'}`}
            />
            <input 
              type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className={`flex-1 p-3 rounded-xl border-none text-xs ${darkMode ? 'bg-[#121826]' : 'bg-gray-100'}`}
            />
            <button type="submit" className="bg-indigo-600 text-white px-8 rounded-xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg active:scale-95">EKLE</button>
          </form>

          <div className={`flex p-1 rounded-xl gap-1 mb-8 ${darkMode ? 'bg-[#121826]' : 'bg-gray-100'}`}>
            {["all", "active", "completed"].map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${filter === t ? (darkMode ? 'bg-[#1f2937] text-indigo-400 shadow-xl border border-gray-700' : 'bg-white shadow text-indigo-600') : 'text-gray-500'}`}>
                {t === 'all' ? 'HEPSİ' : t === 'active' ? 'BEKLEYEN' : 'BİTEN'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} 
                toggleComplete={(id) => setTodos(todos.map(t => t.id === id ? {...t, completed: !t.completed} : t))}
                deleteTodo={(id) => setTodos(todos.filter(t => t.id !== id))}
                isDarkMode={darkMode} 
              />
            ))}
          </div>
        </div>

        {/* SAĞ SÜTUN: POMODORO & NOTLAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* POMODORO PANELİ */}
          <div className={`p-8 rounded-[2rem] shadow-2xl border text-center ${darkMode ? 'bg-[#1f2937] border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Pomodoro</h2>
            <div className="text-5xl font-mono font-black text-indigo-500 mb-6 tracking-tighter">{formatTime(timeLeft)}</div>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-bold opacity-40 uppercase">TUR: {currentSession}/{sessions}</span>
                <select value={sessions} onChange={(e) => {setSessions(parseInt(e.target.value)); setTimeLeft(25*60); setIsActive(false); setCurrentSession(1);}}
                  className={`text-[10px] p-1.5 rounded-lg border-none font-bold ${darkMode ? 'bg-[#121826]' : 'bg-gray-100'}`}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>25 x {n}</option>)}
                </select>
              </div>
              <button onClick={() => setIsActive(!isActive)} className={`w-full py-4 rounded-2xl font-black text-xs tracking-widest transition-all shadow-lg active:scale-95 ${isActive ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                {isActive ? 'DURDUR' : 'BAŞLAT'}
              </button>
            </div>
          </div>

          {/* HIZLI NOTLAR PANELİ */}
          <div className={`p-8 rounded-[2rem] shadow-2xl border ${darkMode ? 'bg-[#1f2937] border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">📄</span>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Hızlı Notlar</h2>
            </div>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Fikirlerini buraya karala..."
              className={`w-full h-72 p-5 rounded-2xl border-none focus:ring-1 focus:ring-indigo-500 resize-none text-[11px] leading-relaxed font-medium ${darkMode ? 'bg-[#121826] text-gray-300' : 'bg-indigo-50/30 text-gray-700'}`}
            />
            <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-green-500 uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               Otomatik Kaydediliyor
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TodoPage;