import Image from 'next/image';

const SmallFoodCard = ({ foods, loading, error, formatDistance, onFoodCardClick }) => {
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get expiry text and color
  const getExpiryInfo = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    
    if (daysLeft < 0) {
      return { text: 'Expired', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    } else if (daysLeft === 0) {
      return { text: 'Expires today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else if (daysLeft === 1) {
      return { text: '1 day left', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else if (daysLeft <= 3) {
      return { text: `${daysLeft} days left`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { text: `${daysLeft} days left`, color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="ml-2 text-gray-600">Loading food items...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }
  
  if (foods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No food items available yet.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
        {foods.map((food) => {
          const expiryInfo = getExpiryInfo(food.expiryDate);
          
          return (
            <div 
              key={food._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" 
              style={{ width: '280px' }}
              onClick={() => onFoodCardClick && onFoodCardClick(food)}
            >
              {/* Food Image */}
              <div className="relative h-40 bg-gray-200">
                {food.imageUrl ? (
                  <Image
                    src={food.imageUrl}
                    alt={food.name}
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Food Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{food.name}</h3>
                
                {/* Distance and Expiry Date */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center text-sm text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{formatDistance(food.distance)}</span>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${expiryInfo.bgColor} ${expiryInfo.color}`}>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {expiryInfo.text}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {food.description || 'No description available'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmallFoodCard;