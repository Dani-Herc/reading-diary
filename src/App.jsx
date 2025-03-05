import { Routes, Route } from "react-router-dom";
import AddBook from "./components/AddBook";
import CategoryPage from "./components/CategoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AddBook />} />
      <Route path="/category/:category" element={<CategoryPage />} />
    </Routes>
  );
}

export default App;
