import React from 'react';

const BlogCategories = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => setActiveCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default BlogCategories;