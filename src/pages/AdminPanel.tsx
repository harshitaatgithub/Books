import books from '../data/books.json';
import { getUserFromToken } from '../utils/auth';

const AdminPanel = () => {
  const user = getUserFromToken();
  if (user?.role !== 'admin') return <p>Access Denied</p>;

  return (
    <div className="p-4">
      <h2>Admin Panel</h2>
      <ul>
        {books.map(book => (
          <li key={book.id} className="border p-2 m-2">
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
