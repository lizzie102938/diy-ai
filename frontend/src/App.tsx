import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Results } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
