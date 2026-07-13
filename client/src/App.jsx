import { Routes, Route } from 'react-router-dom';
import { BasicLayout } from './layouts/BasicLayout';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<BasicLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
