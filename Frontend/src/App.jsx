import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

export default function App() {
  const [tab, setTab] = useState('register');

  return (
    <div className="container">
      <h1>Sistema de Usuários</h1>

      <div className="tabs">
        <button
          className={tab === 'register' ? 'active' : ''}
          onClick={() => setTab('register')}
        >
          Cadastro
        </button>
        <button
          className={tab === 'login' ? 'active' : ''}
          onClick={() => setTab('login')}
        >
          Login
        </button>
      </div>

      {tab === 'register' ? (
        <RegisterForm onSuccess={() => setTab('login')} />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
