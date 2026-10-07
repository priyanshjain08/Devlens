import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Workspace from './pages/Workspace.jsx';
import History from './pages/History.jsx';
import useClientId from './hooks/useClientId.js';

export default function App() {
  const clientId = useClientId();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Workspace clientId={clientId} />} />
          <Route path="/history" element={<History clientId={clientId} />} />
          <Route path="/history/:id" element={<Workspace clientId={clientId} />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>
          DevLens uses AI to analyze code and can make mistakes — always review findings yourself
          before acting on them. DevLens does not guarantee that any code is secure or bug-free.
        </p>
      </footer>
    </div>
  );
}
