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
import SongDetail from "./components/song/SongDetail";
import Register from "./components/Register";
import AccountPendingVerification from "./pages/approvepage";
import ProtectedRoute from "./pages/ProtectedRoute";
import UnPermission from "./pages/Unpermission";
import UserTable from "./components/admin/UserTable";
import GenreTable from "./components/admin/GenreTable";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<AccountPendingVerification />} />
        <Route path="/unauthorized" element={<UnPermission />} />
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["producer"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/song"
            element={
              <ProtectedRoute allowedRoles={["producer"]}>
                <SongTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/album"
            element={
              <ProtectedRoute allowedRoles={["producer"]}>
                <AlbumTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["producer"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/song/:songId"
            element={
              <ProtectedRoute allowedRoles={["producer"]}>
                <SongDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/song/:songId"
            element={
              <ProtectedRoute allowedRoles={["producer"]}>
                <SongDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/genre"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GenreTable />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
