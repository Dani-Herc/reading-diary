import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Animals"); // Default category
  const navigate = useNavigate();

  const handleAddBook = () => {
    if (!bookName.trim()) return; // Prevent empty books

    const newBook = { id: Date.now(), bookName, author };
    const storedBooks = JSON.parse(localStorage.getItem(`books-${category}`)) || [];
    localStorage.setItem(`books-${category}`, JSON.stringify([...storedBooks, newBook]));

    // Redirect to category page
    navigate(`/category/${category}`);
  };

  return (
    <div>
      <h2>Add a Book</h2>
      <input
        type="text"
        placeholder="Book Name"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Animals">Animals</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Mystery">Mystery</option>
      </select>
      <button onClick={handleAddBook}>Add Book</button>
    </div>
  );
};

export default AddBook;
