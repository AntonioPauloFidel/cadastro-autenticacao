import { useState } from 'react';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';

export default function App() {
  const [user, setUser] = useState(null);

  if (user) {
    return <HomePage user={user} onLogout={() => setUser(null)} />;
  }

  return <AuthPage onLogin={setUser} />;
}
