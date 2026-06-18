import { useAuth } from '../contexts/AuthContext';
import { UsersProvider, useUsers } from '../contexts/UsersContext';

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function formatDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw.replace(' ', 'T') + 'Z');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function Pagination() {
  const { pagination, page, setPage } = useUsers();
  const { totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        aria-label="Próxima página"
      >
        ›
      </button>

      <span className="page-info">{total} {total === 1 ? 'usuário' : 'usuários'}</span>
    </div>
  );
}

function UsersTable() {
  const { users, pagination, loading, error, search, handleSearch, page } = useUsers();
  const { user } = useAuth();

  return (
    <>
      <div className="section-header">
        <h3>Usuários cadastrados</h3>
        {!loading && !error && (
          <span className="badge">
            {pagination.total} {pagination.total === 1 ? 'usuário' : 'usuários'}
          </span>
        )}
      </div>

      <div className="search-bar-wrapper">
        <span className="search-icon">⌕</span>
        <input
          className="search-bar"
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => handleSearch('')} aria-label="Limpar busca">
            ×
          </button>
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
          <div className="empty-state">
            {search ? `Nenhum resultado para "${search}".` : 'Nenhum usuário cadastrado ainda.'}
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <>
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

            <Pagination />
          </>
        )}
      </div>
    </>
  );
}

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <UsersProvider>
      <div className="home-page">
        <nav className="navbar">
          <div className="navbar-brand">UserHub</div>

          <div className="navbar-right">
            <div className="user-pill">
              <div className="avatar">{initials(user.name)}</div>
              <span>{user.name.split(' ')[0]}</span>
            </div>
            <button className="btn-logout" onClick={logout}>
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

          <UsersTable />
        </div>
      </div>
    </UsersProvider>
  );
}