import axiosInstance from '../../../lib/axios';

class AuthService {
  async login(email, password, companyId = null) {
    try {
      const response = await axiosInstance.post('/core/auth/login', {
        email,
        password,
        companyId
      });

      const { token, userId, companyId: userCompanyId, roleId } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('companyId', userCompanyId);
      localStorage.setItem('roleId', roleId);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  }

  async register(companyData, userData) {
    try {
      const response = await axiosInstance.post('/core/auth/register', {
        company: companyData,
        user: userData
      });

      const { token, userId, companyId, roleId } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('companyId', companyId);
      localStorage.setItem('roleId', roleId);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrar'
      };
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyId');
    localStorage.removeItem('roleId');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  getCompanyId() {
    return localStorage.getItem('companyId');
  }

  getRoleId() {
    return localStorage.getItem('roleId');
  }
}

export default new AuthService();
