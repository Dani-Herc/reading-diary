import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBook, updateBackground } from '../store/bookSlice';

const categories = ['Animals', 'Fantasy', 'Adventure']; // Updated from ['Dogs', 'Fantasy', 'Adventure']

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(categories[0]); // Default to 'Animals'
  const [backgroundFile, setBackgroundFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryLower = category.toLowerCase();

    // Dispatch the book addition
    dispatch(addBook({ title, author, category: categoryLower }));

    // Handle background file if provided
    if (backgroundFile) {
      const backgroundPath = `/backgrounds/${categoryLower}-background.jpg`; // Update path for 'animals'
      dispatch(updateBackground({ category: categoryLower, backgroundPath }));
      
      // Simulate file upload (in a real app, you'd upload to a server or Electron file system)
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target.result;
        // Here, you’d save the image to public/backgrounds/ via Electron or a server
        // For now, we’ll just use the path
      };
      reader.readAsDataURL(backgroundFile);
    }

    navigate(`/category/${categoryLower}`);
  };

  const handleBackgroundChange = (e) => {
    setBackgroundFile(e.target.files[0]);
  };

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      <h1>Add a Book</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleBackgroundChange}
          style={{ display: 'block', margin: '10px 0' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;