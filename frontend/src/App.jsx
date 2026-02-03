import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Edit_profile";
import SearchPage from "./pages/SearchPage";

import ProtectedRoute from "./router/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import FollowersPage from "./pages/FollowersPage";
import FollowingPage from "./pages/FollowingPage";
import CreatePost from "./pages/CreatePost";
import PostDetailPage from "./pages/PostDetailPage";


function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected + Layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/users/:username" element={<Profile />} />
        <Route path="/followers/:username" element={<FollowersPage />} />
        <Route path="/following/:username" element={<FollowingPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
