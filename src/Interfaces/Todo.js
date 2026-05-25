/**
 * @interface ITodo
 * @description Uygulama genelinde kullanılacak Görev (To-Do) veri modelinin yapısı
 */
export const ITodo = {
  id: "number",        // Benzersiz zaman damgası (Date.now())
  text: "string",      // Görev tanımı
  date: "string",      // Görevin hedef tarihi (YYYY-MM-DD)
  completed: "boolean" // Tamamlanma durumu
};