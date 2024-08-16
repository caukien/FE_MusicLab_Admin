import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import SongTable from "./components/song/SongTable";
import MainLayout from "./components/layout/MainLayout";
import AlbumTable from "./components/album/AlbumTable";
import Profile from "./components/profile/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/song" element={<SongTable />} />
          <Route path="/album" element={<AlbumTable />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
