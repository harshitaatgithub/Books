import { getUserFromToken } from "../utils/auth";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAuthor: string;
  setSelectedAuthor: (author: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedAuthor,
  setSelectedAuthor,
}) => {
  const user = getUserFromToken();


  // Show search only on library page
  const showSearch = location.pathname === "/library" && user;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        {/* Search Section - Only show on library page */}
          {showSearch && (
            <div className="flex-1 max-w-lg mx-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Authors</option>
                  <option value="Ava Mitchell">Ava Mitchell</option>
                  <option value="Emma Clarke">Emma Clarke</option>
                  <option value="Grace Morgan">Grace Morgan</option>
                  <option value="Henry Brooks">Henry Brooks</option>
                  <option value="Liam Hayes">Liam Hayes</option>
                  <option value="Lucas Gray">Lucas Gray</option>
                  <option value="Mia Sullivan">Mia Sullivan</option>
                  <option value="Noah Parker">Noah Parker</option>
                  <option value="Olivia Bennett">Olivia Bennett</option>
                  <option value="Sophia Turner">Sophia Turner</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
