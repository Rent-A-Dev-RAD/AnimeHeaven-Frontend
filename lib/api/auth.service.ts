export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role?: string;
    profileImage?: string | null;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  profileImage?: string | null;
}

class AuthService {  // Regisztráció
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🟢 Sending register request:', data);
      
      // Next.js API route-on keresztül hívjuk a backend-et
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('🟢 Register response:', { status: response.status, result });

      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Regisztráció sikertelen',
        };
      }

      return {
        success: true,
        message: result.message || 'Sikeres regisztráció',
        token: result.token,
        user: result.user,
      };
    } catch (error) {
      console.error('Regisztráció hiba:', error);
      return {
        success: false,
        message: 'Hálózati hiba történt',
      };
    }
  }
  // Bejelentkezés
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Next.js API route-on keresztül hívjuk a backend-et
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('🟢 auth.service login response:', { status: response.status, result });

      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Bejelentkezés sikertelen',
        };
      }

      // Token mentése
      if (result.token) {
        console.log('🟢 Saving token...');
        this.setToken(result.token);
      }

      // User adatok mentése
      if (result.user) {
        console.log('🟢 Saving user:', result.user);
        this.setUser(result.user);
      }

      return {
        success: true,
        message: result.message || 'Sikeres bejelentkezés',
        token: result.token,
        user: result.user,
      };
    } catch (error) {
      console.error('Bejelentkezés hiba:', error);
      return {
        success: false,
        message: 'Hálózati hiba történt',
      };
    }
  }

  // Bejelentkezett felhasználó adatainak lekérése
  async getMe(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      // Next.js API route-on keresztül hívjuk a backend-et
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('GetMe hiba:', error);
      return null;
    }
  }

  // Kijelentkezés
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Token műveletek
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // User műveletek
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  // Ellenőrzi, hogy be van-e jelentkezve a user
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  // Autentikált fetch helper
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export const authService = new AuthService();
