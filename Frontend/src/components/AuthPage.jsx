import { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login');

  return (
    <div className="auth-page">
      <div className="auth-banner">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="20" r="12" fill="white" fillOpacity="0.9" />
          <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" fillOpacity="0.9"/>
        </svg>
        <h1>Bem-vindo ao Sistema</h1>
        <p>Gerencie seus usuários com segurança e praticidade.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>{tab === 'login' ? 'Entrar na conta' : 'Criar conta'}</h2>
          <p className="subtitle">
            {tab === 'login'
              ? 'Acesse sua conta para continuar'
              : 'Preencha os dados para se cadastrar'}
          </p>

          <div className="tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>
              Login
            </button>
            <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>
              Cadastro
            </button>
          </div>

          {tab === 'login' ? (
            <LoginForm onLogin={onLogin} onSwitchToRegister={() => setTab('register')} />
          ) : (
            <RegisterForm onSuccess={() => setTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
