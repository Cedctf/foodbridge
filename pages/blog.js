import { useState } from 'react';
import Head from 'next/head';
import BlogCard from '../components/BlogCard';
import BlogSearch from '../components/BlogSearch';
import BlogCategories from '../components/BlogCategories';

// Sample blog posts data - replace with your actual data source or API call
const sampleBlogPosts = [
  {
    id: 1,
    title: "The Impact of Food Waste on Our Planet",
    slug: "impact-food-waste-planet",
    excerpt: "Learn about the environmental consequences of food waste and how it contributes to climate change.",
    content: "Full article content here...",
    imageUrl: "/blog-images/blog1.jpg",
    date: "June 15, 2023",
    category: "Environment",
    author: "Sarah Johnson"
  },
  {
    id: 2,
    title: "Sustainable Living Tips for Reducing Food Waste",
    slug: "sustainable-living-tips-reducing-food-waste",
    excerpt: "Discover practical tips and strategies for reducing food waste in your daily life and promoting sustainability.",
    content: "Full article content here...",
    imageUrl: "/blog-images/blog2.jpg",
    date: "July 22, 2023",
    category: "Sustainability",
    author: "Michael Chen"
  },
  {
    id: 3,
    title: "Community Initiatives Fighting Food Waste",
    slug: "community-initiatives-fighting-food-waste",
    excerpt: "Explore inspiring stories of community-led initiatives and organizations working to combat food waste and support those in need.",
    content: "Full article content here...",
    imageUrl: "/blog-images/blog3.jpg",
    date: "August 10, 2023",
    category: "Community",
    author: "Lisa Wong"
  },
  {
    id: 4,
    title: "Composting 101: Turn Food Scraps into Garden Gold",
    slug: "composting-101-food-scraps-garden",
    excerpt: "Learn the basics of composting and how to turn your food scraps into valuable nutrients for your garden.",
    content: "Full article content here...",
    imageUrl: "/blog-images/blog4.jpg",
    date: "September 5, 2023",
    category: "Gardening",
    author: "David Miller"
  },
  {
    id: 5,
    title: "Meal Planning to Minimize Waste",
    slug: "meal-planning-minimize-waste",
    excerpt: "Effective strategies for meal planning that help reduce food waste while saving money and time.",
    content: "Full article content here...",
    imageUrl: "/blog-images/blog5.jpg",
    date: "October 18, 2023",
    category: "Cooking",
    author: "Emma Thompson"
  },
  {
    id: 6,
    title: "Food Preservation Techniques for Longer Shelf Life",
    slug: "food-preservation-techniques-longer-shelf-life",
    excerpt: "Discover various methods to preserve food and extend its shelf life, from freezing to fermentation.",
    content: "Full article content here...",
    imageUrl: "/blog-images/blog6.jpg",
    date: "November 30, 2023",
    category: "Cooking",
    author: "James Wilson"
  }
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Extract unique categories from blog posts
  const categories = [...new Set(sampleBlogPosts.map(post => post.category))];
  
  // Filter posts based on search query and active category
  const filteredPosts = sampleBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory ? post.category === activeCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>Blog - FoodBridge</title>
        <meta name="description" content="Explore articles and stories about food waste reduction, sustainable living, and related topics." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore articles and stories about food waste reduction, sustainable living, and related topics.
            </p>
          </div>
          
          {/* Search */}
          <BlogSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          {/* Categories */}
          <BlogCategories 
            categories={categories} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          {/* Blog Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
          
          {/* Pagination section removed */}
        </div>
      </div>
    </>
  );
}