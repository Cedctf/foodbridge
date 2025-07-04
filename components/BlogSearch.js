import React from 'react';

const BlogSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-[#45A180]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-none text-[#45A180] placeholder-[#45A180]/60 rounded-xl shadow-sm bg-white focus:outline-none"
        />
      </div>
    </div>
  );
};

export default BlogSearch;