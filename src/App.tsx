import { lazy, Suspense, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Favorites from "./pages/Favorites";
import BorrowedBooks from "./pages/BorrowedBooks";
import UserDashboard from "./pages/UserDashboard";
import LoadingSpinner from "./components/LoadingSpinner";
import { getUserFromToken } from "./utils/auth";

// Lazy load Library and UsersInfo pages
const Library = lazy(() => import("./pages/Library"));
const UsersInfo = lazy(() => import("./pages/UsersInfo"));

const App = () => {
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {user && (
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
          />
        )}

        <div className="flex flex-1">
          {user && (
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
          )}

          <main
            className={`flex-1 transition-all duration-300 ${
              user ? (isSidebarCollapsed ? "ml-16" : "ml-64") : ""
            }`}
          >
            <Suspense fallback={<LoadingSpinner />}>
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
                      <UsersInfo />
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
            </Suspense>
          </main>
        </div>

        {user && <Footer />}
      </div>
    </Router>
  );
};

export default App;
