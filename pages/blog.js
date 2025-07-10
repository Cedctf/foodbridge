import { useState } from 'react';
import Head from 'next/head';
import BlogSearch from '../components/BlogSearch';
import BlogCategories from '../components/BlogCategories';
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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
    author: "Sarah Johnson",
    tags: ["Environment", "Sustainability"]
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
    author: "Michael Chen",
    tags: ["Sustainability", "Lifestyle"]
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
    author: "Lisa Wong",
    tags: ["Community", "Social Impact"]
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
    author: "David Miller",
    tags: ["Gardening", "Composting"]
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
    author: "Emma Thompson",
    tags: ["Cooking", "Meal Planning"]
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
    author: "James Wilson",
    tags: ["Cooking", "Preservation"]
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

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <div className="pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
              <p className="text-[oklch(59.6%_0.145_163.225)]">Explore articles and stories about food waste reduction, sustainable living, and related topics.</p>
            </div>
          </div>
        </div>
        
        {/* Search and Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <BlogSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          {/* Categories */}
          <BlogCategories 
            categories={categories} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          {/* Blog Posts using Blog8 design */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
            </div>
                    ) : (
            <div className="pt-8 pb-16">
              <div className="space-y-16">
                {filteredPosts.map((post, index) => (
                  <div key={post.id}>
                    <Card
                      className="border-0 bg-transparent shadow-none">
                      <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                        <div className="sm:col-span-5">
                          <div className="mb-4 md:mb-6">
                            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider md:gap-5 lg:gap-6">
                              {post.tags?.map((tag) => <span key={tag} style={{ color: '#45a180' }}>{tag}</span>)}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                            <a href={`/blog/${post.slug}`} className="hover:underline">
                              {post.title}
                            </a>
                          </h3>
                          <p className="mt-4 text-muted-foreground md:mt-5">
                            {post.excerpt}
                          </p>
                          <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                            <span className="text-muted-foreground">{post.author}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {post.date}
                            </span>
                          </div>
                          <div className="mt-6 flex items-center space-x-2 md:mt-8">
                            <a
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center font-semibold hover:underline md:text-base"
                              style={{ color: 'oklch(59.6% 0.145 163.225)' }}>
                              <span>Read more</span>
                              <ArrowRight className="ml-2 size-4 transition-transform" />
                            </a>
                          </div>
                        </div>
                        <div className="order-first sm:order-last sm:col-span-5">
                          <a href={`/blog/${post.slug}`} className="block">
                            <div className="aspect-[21/9] overflow-clip rounded-lg border border-border">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70" />
                            </div>
                          </a>
                        </div>
                      </div>
                    </Card>
                    {index < filteredPosts.length - 1 && (
                      <div className="mt-8 mb-8 border-t border-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}