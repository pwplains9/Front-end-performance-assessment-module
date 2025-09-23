// Пример утилиты с проблемами
const API_BASE_URL = 'https://api.example.com'; // Захардкоженный URL

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Проблема: слишком длинная функция
  async fetchUserData(userId, includeProfile = true, includePreferences = false, includeHistory = false, includeStats = false) {
    if (!userId) {
      throw new Error('Error'); // Плохое сообщение об ошибке
    }

    let url = `${this.baseURL}/users/${userId}`;
    
    // Проблема: сложная логика построения URL
    if (includeProfile || includePreferences || includeHistory || includeStats) {
      url += '?';
      const params = [];
      
      if (includeProfile) params.push('include=profile');
      if (includePreferences) params.push('include=preferences');
      if (includeHistory) params.push('include=history');
      if (includeStats) params.push('include=stats');
      
      url += params.join('&');
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      }

      const data = await response.json();
      
      // Проблема: мутация данных
      if (data.profile) {
        data.profile.fullName = `${data.profile.firstName} ${data.profile.lastName}`;
      }
      
      return data;
      
    } catch (error) {
      console.error('API Error:', error); // Логирование в production
      throw error;
    }
  }

  // Проблема: дублирование кода
  async fetchUserPosts(userId) {
    if (!userId) {
      throw new Error('Error');
    }

    const url = `${this.baseURL}/users/${userId}/posts`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Posts not found');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      }

      return await response.json();
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Проблема: синхронная функция в асинхронном классе
  validateUserId(userId) {
    return typeof userId === 'string' && userId.length > 0;
  }
}

// Проблема: создание глобального экземпляра
const apiService = new ApiService();

export default apiService;
