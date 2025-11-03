# API Pagination & Filtering Guide

## ✅ What's Been Implemented

All major GET endpoints now support:
- **Pagination** (limit results per request)
- **Shuffling/Randomization** (random order)
- **Filtering** (by various criteria)
- **Sorting** (order by different fields)

## 📋 Endpoints Updated

### 1. Public Profiles - `GET /api/public-profiles`

#### Query Parameters:
```
page         - Page number (default: 1)
limit        - Items per page (default: 20)
shuffle      - Random order (true/false)
interests    - Filter by interests (comma-separated)
isOnline     - Filter online users only (true/false)
```

#### Examples:
```bash
# Get first 20 profiles (default)
GET /api/public-profiles

# Get page 2 with 10 profiles per page
GET /api/public-profiles?page=2&limit=10

# Get 20 random profiles (shuffled)
GET /api/public-profiles?shuffle=true

# Get online users only
GET /api/public-profiles?isOnline=true&limit=20

# Get profiles interested in sports or music
GET /api/public-profiles?interests=sports,music&limit=15
```

#### Response Format:
```json
{
  "data": [...], // Array of profiles
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2. Linkups - `GET /api/linkups`

#### Query Parameters:
```
page         - Page number (default: 1)
limit        - Items per page (default: 20)
shuffle      - Random order (true/false)
privacy      - Filter by privacy (public/private)
interests    - Filter by interests (comma-separated)
```

#### Examples:
```bash
# Get first 20 linkups (default)
GET /api/linkups

# Get 30 random linkups
GET /api/linkups?shuffle=true&limit=30

# Get public linkups only
GET /api/linkups?privacy=public

# Get linkups for sports enthusiasts
GET /api/linkups?interests=sports,fitness&limit=20

# Get page 3 of linkups (sorted newest first)
GET /api/linkups?page=3&limit=15
```

#### Response Format:
```json
{
  "data": [...], // Array of linkups with populated members and creator
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 50,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 3. Apartments - `GET /api/apartments`

#### Query Parameters:
```
page         - Page number (default: 1)
limit        - Items per page (default: 10)
shuffle      - Random order (true/false)
city         - Filter by city
state        - Filter by state
minPrice     - Minimum price per night
maxPrice     - Maximum price per night
maxGuests    - Minimum guest capacity
amenities    - Required amenities (comma-separated)
isAvailable  - Availability filter (true/false)
sortBy       - Sort field (default: createdAt)
sortOrder    - Sort direction (asc/desc, default: desc)
```

#### Examples:
```bash
# Get 20 random apartments
GET /api/apartments?shuffle=true&limit=20

# Get apartments in New York
GET /api/apartments?city=New York&limit=15

# Get apartments $50-$150 per night
GET /api/apartments?minPrice=50&maxPrice=150

# Get apartments with WiFi and Pool
GET /api/apartments?amenities=wifi,pool

# Get available apartments sorted by price (low to high)
GET /api/apartments?isAvailable=true&sortBy=pricePerNight&sortOrder=asc
```

#### Response Format:
```json
{
  "apartments": [...], // Array of apartments
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalApartments": 75,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🎯 Frontend Implementation Guide

### React Example (with Infinite Scroll)

```javascript
import { useState, useEffect } from 'react';
import api from './api'; // Your axios instance

function PublicProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const response = await api.get('/public-profiles', {
        params: {
          page: pageNum,
          limit: 20,
          shuffle: false // Set to true for random order
        }
      });

      const { data, pagination } = response.data;
      
      if (append) {
        setProfiles(prev => [...prev, ...data]);
      } else {
        setProfiles(data);
      }
      
      setHasMore(pagination.hasNextPage);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(1, false);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProfiles(nextPage, true);
    }
  };

  return (
    <div>
      {profiles.map(profile => (
        <ProfileCard key={profile._id} profile={profile} />
      ))}
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### React Example (with Pagination Buttons)

```javascript
function LinkupsWithPagination() {
  const [linkups, setLinkups] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLinkups = async (page) => {
    try {
      const response = await api.get('/linkups', {
        params: {
          page,
          limit: 20,
          shuffle: false
        }
      });

      setLinkups(response.data.data);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching linkups:', error);
    }
  };

  useEffect(() => {
    fetchLinkups(1);
  }, []);

  return (
    <div>
      {linkups.map(linkup => (
        <LinkupCard key={linkup._id} linkup={linkup} />
      ))}
      
      <div className="pagination">
        <button 
          onClick={() => fetchLinkups(currentPage - 1)}
          disabled={!pagination?.hasPrevPage}
        >
          Previous
        </button>
        
        <span>Page {pagination?.currentPage} of {pagination?.totalPages}</span>
        
        <button 
          onClick={() => fetchLinkups(currentPage + 1)}
          disabled={!pagination?.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### React Example (Randomized Feed)

```javascript
function RandomizedFeed() {
  const [items, setItems] = useState([]);
  
  const fetchRandomItems = async () => {
    try {
      const response = await api.get('/linkups', {
        params: {
          shuffle: true,  // ✅ Random order
          limit: 30
        }
      });
      
      setItems(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchRandomItems();
  }, []);

  const refreshFeed = () => {
    fetchRandomItems(); // Get new random items
  };

  return (
    <div>
      <button onClick={refreshFeed}>🔄 Refresh Feed</button>
      {items.map(item => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}
```

---

## 🔧 Technical Details

### Why Backend Pagination?

✅ **Performance**: Only load what's needed, reduce bandwidth
✅ **Scalability**: Handle thousands of records efficiently
✅ **Security**: Prevent data scraping of entire database
✅ **User Experience**: Faster page loads, smoother scrolling

### MongoDB Aggregation for Shuffling

We use MongoDB's `$sample` stage for true randomization:

```javascript
// Instead of loading all data and shuffling in memory
await Model.aggregate([
  { $match: filter },
  { $sample: { size: limit } } // Efficient random sampling
]);
```

This is **much faster** than:
1. Loading all records
2. Shuffling in JavaScript
3. Sending to client
4. Client-side filtering

### Response Structure

All paginated endpoints now return consistent structure:

```javascript
{
  data: [],           // The actual items
  pagination: {
    currentPage,      // Current page number
    totalPages,       // Total pages available
    totalItems,       // Total items in database
    itemsPerPage,     // Limit per page
    hasNextPage,      // Boolean for next page
    hasPrevPage       // Boolean for previous page
  }
}
```

---

## 🎨 Best Practices

### 1. **Set Reasonable Limits**
```javascript
// ❌ Don't fetch too many at once
GET /api/profiles?limit=1000

// ✅ Use reasonable pagination
GET /api/profiles?limit=20
```

### 2. **Use Shuffle for Discovery Features**
```javascript
// For "Discover" or "Explore" pages
GET /api/linkups?shuffle=true&limit=30

// For regular listing pages
GET /api/linkups?page=1&limit=20
```

### 3. **Combine Filters**
```javascript
// Get random online users interested in sports
GET /api/public-profiles?shuffle=true&isOnline=true&interests=sports&limit=15
```

### 4. **Handle Empty Results**
```javascript
const { data, pagination } = response.data;

if (data.length === 0) {
  // Show "No results found" message
}
```

---

## 🚀 Performance Tips

1. **Indexes**: Ensure your MongoDB collections have proper indexes on frequently queried fields
2. **Caching**: Consider caching popular queries on the backend
3. **Limit Shuffling**: Use shuffle sparingly as it's more expensive than sorted queries
4. **Virtual Scroll**: Implement virtual scrolling for very long lists on frontend

---

## 📊 Migration Checklist

- [x] Update `getLinkups` with pagination & shuffle
- [x] Update `getAllPublicProfiles` with pagination & shuffle
- [x] Update `getApartments` with shuffle support (already had pagination)
- [ ] Update frontend components to use new response structure
- [ ] Test all endpoints with various query combinations
- [ ] Add loading states and error handling on frontend
- [ ] Implement infinite scroll or pagination UI components
