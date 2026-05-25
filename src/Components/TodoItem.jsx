import { ITodo } from '../Interfaces/Todo';

const TodoItem = ({ todo, toggleComplete, deleteTodo, isDarkMode }) => {
  
  // ITodo modelindeki kurallara göre durum kontrolü yapılıyor
  const getStatus = () => {
    if (!todo.date) return { label: "Tarihsiz", style: "bg-gray-100 text-gray-500" };
    if (todo.completed) return { label: "✓ Tamamlandı", style: "bg-green-100 text-green-700" };
    
    // 2026 yılı güncel tarihi formatına göre kontrol
    const today = new Date().toISOString().split('T')[0];
    if (todo.date < today) return { label: "Süresi Geçti!", style: "bg-red-500 text-white animate-pulse" };
    if (todo.date === today) return { label: "Bugün Yapılacak!", style: "bg-orange-500 text-white font-bold" };
    
    return { label: `Hedef: ${todo.date}`, style: isDarkMode ? "bg-gray-700 text-gray-300" : "bg-blue-50 text-blue-600" };
  };

  const status = getStatus();

  return (
    <div className={`group flex items-center justify-between p-4 rounded-xl mb-2 transition-all border ${isDarkMode ? 'bg-[#1f2937]/50 border-gray-700 hover:border-indigo-500' : 'bg-white border-gray-100 shadow-sm hover:border-indigo-300'}`}>
      <div className="flex items-center gap-4">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => toggleComplete(todo.id)}
          className="w-5 h-5 cursor-pointer accent-indigo-600 rounded-lg"
        />
        <div className="flex flex-col">
          <span className={`text-sm font-semibold transition-all ${todo.completed ? 'line-through opacity-40' : (isDarkMode ? 'text-gray-100' : 'text-gray-800')}`}>
            {todo.text}
          </span>
          <span className={`text-[9px] w-fit px-2 py-0.5 rounded-md mt-1 font-bold uppercase tracking-wider ${status.style}`}>
            {status.label}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button onClick={() => deleteTodo(todo.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;