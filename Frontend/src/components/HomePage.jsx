import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function formatDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw.replace(' ', 'T') + 'Z');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function HomePage({ user, onLogout }) {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    axios
      .get(`${API_URL}/users`)
      .then((res) => setUsers(res.data.users))
      .catch(() => setError('Não foi possível carregar os usuários.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-brand">
          {/* <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="10" r="6" fill="#6366f1" />
            <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          </svg> */}
          
        </div>

        <div className="navbar-right">
          <div className="user-pill">
            <div className="avatar">{initials(user.name)}</div>
            <span>{user.name.split(' ')[0]}</span>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Sair
          </button>
        </div>
      </nav>

      <div className="home-content">
        <div className="welcome-banner">
          <div>
            <h2>Olá, {user.name.split(' ')[0]}! 👋</h2>
            <p>Você está logado como <strong>{user.email}</strong></p>
          </div>
          <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="48" cy="30" r="18" fill="white" />
            <path d="M12 84c0-19.882 16.118-36 36-36s36 16.118 36 36" stroke="white" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>

        <div className="section-header">
          <h3>Usuários cadastrados</h3>
          {!loading && !error && (
            <span className="badge">{users.length} {users.length === 1 ? 'usuário' : 'usuários'}</span>
          )}
        </div>

        <div className="table-card">
          {loading && (
            <div className="spinner">
              <div className="spin" />
              Carregando...
            </div>
          )}

          {error && !loading && (
            <div className="alert error" style={{ margin: '1.5rem' }}>⚠ {error}</div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="empty-state">Nenhum usuário cadastrado ainda.</div>
          )}

          {!loading && !error && users.length > 0 && (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>ID</th>
                  <th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-row-info">
                        <div className="avatar-lg">{initials(u.name)}</div>
                        <div>
                          <div className="name">
                            {u.name}
                            {u.id === user.id && <span className="you-tag">você</span>}
                          </div>
                          <div className="email-sub">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="id-text">#{u.id}</span></td>
                    <td><span className="date-text">{formatDate(u.created_at)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
