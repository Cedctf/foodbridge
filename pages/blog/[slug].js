import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
// import Footer from '../../components/footer';
import Footer from '../../components/Footer';

// Sample blog posts data - this should match the data in blog.js
const sampleBlogPosts = [
  {
    id: 1,
    title: "The Impact of Food Waste on Our Planet",
    slug: "impact-food-waste-planet",
    excerpt: "Learn about the environmental consequences of food waste and how it contributes to climate change.",
    content: "Food waste is a significant global issue with far-reaching environmental impacts. When food is wasted, all the resources that went into producing it—water, energy, land, labor, and capital—are also wasted. Furthermore, when food waste ends up in landfills, it produces methane, a greenhouse gas that is much more potent than carbon dioxide.\n\nAccording to research, approximately one-third of all food produced globally is wasted. This amounts to about 1.3 billion tons of food waste per year. In developed countries, most food waste occurs at the retail and consumer levels, while in developing countries, it happens primarily during production and processing.\n\nReducing food waste is crucial for mitigating climate change and ensuring food security for future generations. By being mindful of our consumption habits and implementing proper food management practices, we can all contribute to reducing food waste and its environmental impact.",
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
    content: "Reducing food waste starts with small, everyday actions that can make a big difference. Here are some practical tips to help you minimize food waste in your home:\n\n1. **Plan your meals**: Before shopping, plan your meals for the week and make a detailed shopping list. This helps you buy only what you need.\n\n2. **Store food properly**: Learn the best ways to store different types of food to extend their shelf life. For example, keep herbs fresh by placing them in a glass of water, or store bread in the freezer if you won't use it right away.\n\n3. **Understand food labels**: 'Best before' dates are about quality, not safety. Many foods are still safe to eat after this date. Use your senses to determine if food is still good.\n\n4. **Use leftovers creatively**: Transform leftovers into new meals. For instance, leftover vegetables can be used in soups or stir-fries.\n\n5. **Compost food scraps**: If you have food waste, composting is a great way to recycle nutrients back into the soil.\n\nBy adopting these practices, you can significantly reduce your food waste footprint and contribute to a more sustainable future.",
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
    content: "Around the world, communities are coming together to tackle food waste while addressing food insecurity. These initiatives demonstrate the power of collective action and innovation.\n\nOne inspiring example is community fridges, where businesses and individuals can donate excess food for those in need to take freely. These 'freedges' have popped up in cities globally, creating a simple but effective system for food redistribution.\n\nFood rescue organizations are another vital component in the fight against waste. These groups collect surplus food from restaurants, grocery stores, and events that would otherwise be discarded, and deliver it to shelters, soup kitchens, and food banks.\n\nCommunity gardens and urban farming projects not only provide fresh produce but also educate people about sustainable food production and consumption. Many of these initiatives include composting programs that turn food scraps into nutrient-rich soil.\n\nTechnology is also playing a role, with apps connecting consumers to restaurants and stores offering discounted food that would otherwise go to waste at the end of the day.\n\nThese community-driven solutions show that addressing food waste can simultaneously combat hunger, build community connections, and protect the environment.",
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
    content: "Composting is nature's way of recycling, and it's one of the most effective ways to reduce food waste while creating a valuable resource for your garden. Here's a beginner's guide to get you started:\n\n**What is Composting?**\nComposting is the natural process of decomposition that transforms organic waste into a rich soil amendment. Microorganisms, insects, and worms break down organic matter into a dark, crumbly substance called humus.\n\n**What Can Be Composted?**\n- **Green materials** (nitrogen-rich): Fruit and vegetable scraps, coffee grounds, tea bags, fresh grass clippings, plant trimmings\n- **Brown materials** (carbon-rich): Dry leaves, small branches, paper, cardboard, eggshells, nutshells\n\n**What to Avoid Composting:**\n- Meat, fish, and dairy products (can attract pests)\n- Oils and fats\n- Diseased plants\n- Pet waste\n- Treated wood\n\n**Getting Started:**\n1. **Choose a location**: Find a dry, shady spot near a water source.\n2. **Select a bin or create a pile**: You can purchase a compost bin or build your own.\n3. **Layer materials**: Start with brown materials, then add green materials, and continue alternating.\n4. **Maintain moisture**: Your compost should be as moist as a wrung-out sponge.\n5. **Turn regularly**: Every few weeks, turn the pile to aerate it and speed up decomposition.\n\nWith a little patience, your food scraps will transform into nutrient-rich compost that can help your garden thrive while keeping valuable organic matter out of landfills.",
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
    content: "Meal planning is one of the most effective strategies for reducing food waste in your household. When done right, it can also save you money, time, and stress. Here's how to create a waste-conscious meal plan:\n\n**1. Take Inventory First**\nBefore planning meals or shopping, check what you already have in your refrigerator, freezer, and pantry. Plan meals that use ingredients that need to be consumed soon.\n\n**2. Plan Flexible Meals**\nCreate a weekly meal plan that includes flexible recipes that can accommodate substitutions based on what needs to be used up or what's on sale.\n\n**3. Think in Terms of Ingredients, Not Just Recipes**\nWhen buying ingredients like vegetables, plan multiple meals that use them. For example, if you buy a bunch of cilantro for one recipe, plan another meal that will use the remainder.\n\n**4. Embrace Leftovers**\nIntentionally cook larger portions of certain meals to create planned leftovers. These can be repurposed into new meals or packed for lunches.\n\n**5. Use a Shopping List**\nCreate a detailed shopping list based on your meal plan and stick to it to avoid impulse purchases that might go to waste.\n\n**6. Consider Your Schedule**\nBe realistic about your time and energy levels throughout the week. Plan simpler meals for busy days and save more elaborate cooking for when you have more time.\n\n**7. Store Food Properly**\nOnce you've purchased your ingredients, make sure to store them properly to maximize freshness and prevent spoilage.\n\n**8. Regularly Assess and Adjust**\nAt the end of each week, evaluate what worked and what didn't. Did any food go to waste? Why? Use these insights to improve your next meal plan.\n\nWith practice, meal planning becomes second nature and can dramatically reduce the amount of food that ends up in your trash bin.",
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
    content: "Food preservation is an ancient practice that has evolved over thousands of years. By extending the shelf life of food, preservation techniques help reduce waste and ensure food security. Here are some effective methods you can use at home:\n\n**Freezing**\nFreezing is one of the easiest preservation methods. It slows down decomposition by turning moisture into ice, which inhibits the growth of most bacteria. Almost any food can be frozen, though some may change in texture upon thawing. Blanching vegetables before freezing helps maintain their color, flavor, and nutrients.\n\n**Canning**\nCanning involves sealing food in airtight containers and heating them to a temperature that destroys microorganisms. There are two main methods: water bath canning (for high-acid foods like fruits, pickles, and tomatoes) and pressure canning (for low-acid foods like vegetables, meats, and poultry). Proper canning techniques are essential to prevent botulism.\n\n**Drying/Dehydrating**\nRemoval of moisture prevents bacterial growth and enzymatic reactions. You can dry foods using the sun, an oven, or a food dehydrator. This method works well for fruits, vegetables, herbs, and even meats (jerky).\n\n**Fermentation**\nFermentation uses beneficial bacteria to transform food, creating an environment hostile to harmful microorganisms. Examples include yogurt, sauerkraut, kimchi, and kombucha. Beyond preservation, fermentation often enhances nutritional value and adds complex flavors.\n\n**Pickling**\nPickling preserves food in an acidic solution, typically vinegar. The high acidity prevents the growth of harmful bacteria. Almost any vegetable can be pickled, and the process can be as simple as combining vinegar, salt, and spices.\n\n**Salt Curing**\nSalt draws moisture out of food and creates an environment where bacteria cannot thrive. This ancient technique is still used for preserving meats and fish.\n\n**Root Cellaring**\nMany root vegetables, apples, and cabbage can be stored for months in cool, dark, and slightly humid conditions like a root cellar, unheated basement, or garage.\n\nBy mastering these preservation techniques, you can take advantage of seasonal abundance, reduce food waste, and enjoy your favorite foods year-round.",
    imageUrl: "/blog-images/blog6.jpg",
    date: "November 30, 2023",
    category: "Cooking",
    author: "James Wilson"
  }
];

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Find the post that matches the slug
  const post = sampleBlogPosts.find(post => post.slug === slug);
  
  // If the post doesn't exist or the page is still loading the slug
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{post.title} - FoodBridge Blog</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      
      <Navbar />
      
      <main className="pt-20 pb-12 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Image */}
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">{post.title}</h1>
            
            <div className="flex items-center text-black mb-6">
              <span className="mr-4">{post.date}</span>
              <span className="mr-4">•</span>
              <span className="mr-4">By {post.author}</span>
              <span className="mr-4">•</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">{post.category}</span>
            </div>
            
            <p className="text-xl text-black">{post.excerpt}</p>
          </div>
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-black">
            {post.content.split('\n\n').map((paragraph, index) => {
              // Check if paragraph is a header (starts with ** and ends with **)
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h2 key={index} className="text-2xl font-bold text-black mt-8 mb-4">{paragraph.slice(2, -2)}</h2>;
              }
              
              // Check if paragraph is a list item (starts with - or number.)
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc pl-6 mb-4 text-black">
                    <li>{paragraph.slice(2)}</li>
                  </ul>
                );
              }
              
              // Check if paragraph contains bold text (wrapped in ** but not the entire paragraph)
              if (paragraph.includes('**') && !paragraph.startsWith('**')) {
                // Split by ** markers and wrap bold text in <strong> tags
                const parts = paragraph.split('**');
                return (
                  <p key={index} className="mb-4 text-black">
                    {parts.map((part, i) => {
                      return i % 2 === 0 ? part : <strong key={i}>{part}</strong>;
                    })}
                  </p>
                );
              }
              
              // Regular paragraph
              return <p key={index} className="mb-4 text-black">{paragraph}</p>;
            })}
          </div>
          
          {/* Back to Blog Link */}
          <div className="mt-12">
            <Link href="/blog" className="inline-flex items-center hover:opacity-80" style={{ color: 'oklch(59.6% 0.145 163.225)' }}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all articles
            </Link>
          </div>
        </article>
      </main>
      
    </>
  );
}