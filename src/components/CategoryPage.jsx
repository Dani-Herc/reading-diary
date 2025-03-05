import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

const backgrounds = {
  Animals: "/backgrounds/animals-background.png",
  Fantasy: "/backgrounds/fantasy-background.png",
  Mystery: "/backgrounds/mystery-background.png",
};

const CategoryPage = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const positionsRef = useRef({});
  const activeElementRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem(`books-${category}`)) || [];
    setBooks(storedBooks);

    positionsRef.current = JSON.parse(localStorage.getItem(`positions-${category}`)) || {};
  }, [category]);

  const onMouseMove = useCallback((e) => {
    if (!activeElementRef.current) return;
    const x = e.clientX - offset.current.x;
    const y = e.clientY - offset.current.y;

    activeElementRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!activeElementRef.current) return;

    const bookId = activeElementRef.current.getAttribute("data-id");
    const transform = activeElementRef.current.style.transform;
    const [x, y] = transform
      .replace("translate(", "")
      .replace("px", "")
      .replace(")", "")
      .split(",")
      .map(Number);

    positionsRef.current[bookId] = { x, y };
    localStorage.setItem(`positions-${category}`, JSON.stringify(positionsRef.current));

    activeElementRef.current.style.transition = "transform 0.1s ease-out";
    activeElementRef.current = null;
  }, [category]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const startDragging = (e, bookId) => {
    activeElementRef.current = e.target;
    const pos = positionsRef.current[bookId] || { x: 100, y: 100 };
    offset.current.x = e.clientX - pos.x;
    offset.current.y = e.clientY - pos.y;

    activeElementRef.current.style.transition = "none";
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: `url(${backgrounds[category] || "/backgrounds/default.png"}) no-repeat center center/cover`,
        position: "relative",
      }}
    >
      <h2 style={{ color: "white", textAlign: "center", padding: "20px" }}>
        {category} Books
      </h2>

      <div style={{ position: "relative", width: "100%", height: "500px" }}>
        {books.map((book) => {
          const pos = positionsRef.current[book.id] || { x: 100, y: 100 };
          return (
            <div
              key={book.id}
              data-id={book.id}
              className="draggable"
              onMouseDown={(e) => startDragging(e, book.id)}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "red",
                position: "absolute",
                cursor: "grab",
                borderRadius: "10px",
                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
