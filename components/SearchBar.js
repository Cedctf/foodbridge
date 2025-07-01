import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const SearchBar = ({ onPlaceSelect, autocompleteRef }) => {
  const [searchValue, setSearchValue] = useState('');

  const onLoad = (autocomplete) => {
    if (autocompleteRef) {
      autocompleteRef.current = autocomplete;
    }
  };

  const onPlaceChanged = () => {
    if (autocompleteRef && autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        onPlaceSelect(location, place.formatted_address || place.name);
        setSearchValue(place.formatted_address || place.name || '');
      }
    }
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'my' }
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <svg
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#45A180',
              pointerEvents: 'none',
              zIndex: 1,
              borderRadius: '8px'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search locations"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              fontSize: '14px',
              border: 'none',
              borderRadius: '8px',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              backgroundColor: '#ffffff',
              color: '#45A180'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px rgba(69, 161, 128, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          />
        </div>
      </Autocomplete>
    </div>
  );
};

export default SearchBar;