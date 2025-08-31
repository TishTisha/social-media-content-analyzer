import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default: Signup Page */}
        <Route path="/" element={<Navigate to="/auth/signup" />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
