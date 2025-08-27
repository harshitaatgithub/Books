import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Library from "./pages/Library";
import AdminPanel from "./pages/AdminPanel";
import Favorites from "./pages/Favorites";
import BorrowedBooks from "./pages/BorrowedBooks";
import StudentsInfo from "./pages/StudentsInfo";
import UserDashboard from "./pages/UserDashboard";
import { getUserFromToken } from "./utils/auth";
import { useState } from "react";

const App = () => {
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedAuthor={selectedAuthor}
          setSelectedAuthor={setSelectedAuthor}
        />

        <div className="flex flex-1">
          {user && (
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
          )}

          <main
            className={`flex-1 transition-all duration-300 ${
              user ? (isSidebarCollapsed ? "lg:ml-0" : "lg:ml-0") : ""
            }`}
          >
            <Routes>
              <Route
                path="/"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Login />
                }
              />
              <Route
                path="/login"
                element={
                  !user ? <Login /> : <Navigate to="/dashboard" replace />
                }
              />
              <Route
                path="/dashboard"
                element={
                  user ? <UserDashboard /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/library"
                element={
                  user ? (
                    <Library
                      searchQuery={searchQuery}
                      selectedAuthor={selectedAuthor}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/admin"
                element={
                  user?.role === "admin" ? (
                    <AdminPanel />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
              <Route
                path="/favorites"
                element={
                  user ? <Favorites /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/borrowed"
                element={
                  user ? <BorrowedBooks /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/users"
                element={
                  user?.role === "admin" ? (
                    <StudentsInfo />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
              <Route
                path="*"
                element={
                  <Navigate to={user ? "/dashboard" : "/login"} replace />
                }
              />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
