import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = '/api/auth';

export default function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      login(response.data.user);
    } catch (err) {
      if (err.response?.data?.errors?.length) {
        setServerError(err.response.data.errors[0].msg);
      } else {
        setServerError('Não foi possível conectar ao servidor. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && <div className="alert error">⚠ {serverError}</div>}

      <div className="field">
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          type="email"
          placeholder="seu@email.com"
          className={errors.email ? 'error-input' : ''}
          {...register('email', {
            required: 'O e-mail é obrigatório.',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido.' },
          })}
        />
        {errors.email && <span className="error-msg">⚠ {errors.email.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="login-password">Senha</label>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          className={errors.password ? 'error-input' : ''}
          {...register('password', {
            required: 'A senha é obrigatória.',
          })}
        />
        {errors.password && <span className="error-msg">⚠ {errors.password.message}</span>}
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}