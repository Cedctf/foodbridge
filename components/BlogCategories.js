import React from 'react';

const BlogCategories = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => setActiveCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!activeCategory ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default BlogCategories;