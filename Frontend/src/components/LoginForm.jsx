import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export default function LoginForm() {
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMsg('');

    try {
      const response = await axios.post(`${API_URL}/login`, data);
      setSuccessMsg(`Bem-vindo(a), ${response.data.user.name}!`);
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
      {serverError && <div className="alert error">{serverError}</div>}
      {successMsg && <div className="alert success">{successMsg}</div>}

      <div className="field">
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          type="email"
          className={errors.email ? 'error-input' : ''}
          {...register('email', {
            required: 'O e-mail é obrigatório.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Informe um e-mail válido.',
            },
          })}
        />
        {errors.email && <span className="error-msg">{errors.email.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="login-password">Senha</label>
        <input
          id="login-password"
          type="password"
          className={errors.password ? 'error-input' : ''}
          {...register('password', {
            required: 'A senha é obrigatória.',
          })}
        />
        {errors.password && <span className="error-msg">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
