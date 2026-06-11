import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export default function RegisterForm({ onSuccess }) {
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMsg('');

    try {
      const response = await axios.post(`${API_URL}/register`, data);
      setSuccessMsg(response.data.message);
      reset();
      setTimeout(() => onSuccess(), 1500);
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
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          className={errors.name ? 'error-input' : ''}
          {...register('name', {
            required: 'O nome é obrigatório.',
            minLength: { value: 2, message: 'O nome deve ter pelo menos 2 caracteres.' },
          })}
        />
        {errors.name && <span className="error-msg">{errors.name.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
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
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          className={errors.password ? 'error-input' : ''}
          {...register('password', {
            required: 'A senha é obrigatória.',
            minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres.' },
          })}
        />
        {errors.password && <span className="error-msg">{errors.password.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Confirmar Senha</label>
        <input
          id="confirmPassword"
          type="password"
          className={errors.confirmPassword ? 'error-input' : ''}
          {...register('confirmPassword', {
            required: 'A confirmação de senha é obrigatória.',
            validate: (value, formValues) =>
              value === formValues.password || 'As senhas não coincidem.',
          })}
        />
        {errors.confirmPassword && (
          <span className="error-msg">{errors.confirmPassword.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}
