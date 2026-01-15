import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConsentScreen from './pages/ConsentScreen';
import BasicInfoForm from './pages/BasicInfoForm';
import RokomoCheckForm from './pages/RokomoCheckForm';
import ResultScreen from './pages/ResultScreen';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConsentScreen />} />
        <Route path="/basic-info" element={<BasicInfoForm />} />
        <Route path="/rokomo-check" element={<RokomoCheckForm />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
