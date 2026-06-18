import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UsersContext = createContext(null);

const API_URL = 'http://localhost:3001/api/auth';
const PAGE_SIZE = 8;

export function UsersProvider({ children }) {
  const [users, setUsers]         = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearchTerm]   = useState('');
  const [page, setPage]           = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/users`, {
        params: { page, limit: PAGE_SIZE, search },
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      setError('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  return (
    <UsersContext.Provider value={{ users, pagination, loading, error, search, handleSearch, page, setPage, refetch: fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);