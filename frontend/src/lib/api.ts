const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

const getHeaders = () => {
  const token = localStorage.getItem('serena_glow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: getHeaders()
      });
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        let errorMessage = 'API Request failed';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return null;
    } catch (error: any) {
      console.error(`API GET Error [${endpoint}]:`, error.message);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        const error = contentType && contentType.includes('application/json') 
            ? await response.json() 
            : { error: 'API Request failed' };
        throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  },

  async patch(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  }
};
