import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { updateElementPosition } from '../store/bookSlice';

gsap.registerPlugin(Draggable);

const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { books, elements, backgrounds } = useSelector((state) => state.books);
  const categoryLower = category.toLowerCase();
  const categoryElements = elements[categoryLower] || [];
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('Category Elements:', categoryElements);
    categoryElements.forEach((el) => {
      const element = document.getElementById(`element-${el.id}`);
      if (element) {
        gsap.fromTo(
          element,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
        );
        Draggable.create(element, {
          bounds: containerRef.current,
          onDragEnd: () => {
            dispatch(
              updateElementPosition({
                category: categoryLower,
                id: el.id,
                x: element.offsetLeft,
                y: element.offsetTop,
              })
            );
          },
        });
      }
    });
  }, [categoryElements, categoryLower, dispatch]);

  const backgroundsDefault = {
    animals: '/backgrounds/animals-background.png',
    fantasy: '/backgrounds/fantasy-background.png',
    adventure: '/backgrounds/adventure-background.png',
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: `url(${backgrounds[categoryLower] || backgroundsDefault[categoryLower] || '/backgrounds/animals-background.png'}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        height: '100vh',
        position: 'relative',
        padding: '20px',
      }}
    >
      {/* Styled box for category title */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white for contrast
          border: '2px solid #4a90e2', // Blue border for a clean look
          borderRadius: '10px', // Rounded corners
          padding: '20px', // Space inside the box
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          maxWidth: '400px', // Limit width for readability
          margin: '20px auto', // Center the box horizontally
          textAlign: 'center', // Center text
          fontSize: '24px', // Larger, readable title
          fontWeight: 'bold', // Bold for emphasis
          color: '#333', // Dark text for contrast
          textTransform: 'capitalize', // Capitalize first letter of each word
        }}
      >
        {category} Books
      </div>

      {/* Draggable elements (multiple per category, with saved positions) */}
      {categoryElements.map((el) => (
        <div
          id={`element-${el.id}`}
          key={el.id}
          style={{
            position: 'absolute',
            left: el.x,
            top: el.y,
            width: 50,
            height: 50,
            backgroundColor: 'red',
            borderRadius: '5px',
          }}
        />
      ))}
    </div>
  );
};

export default CategoryPage;