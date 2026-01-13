// const API_URL = 'http://localhost:4000';
const API_URL = 'https://api.gobuyly.com';

// Fetch all categories
export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/api/categories_user/all`, {
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    return await response.json()
  } catch (error) {
    console.error(error)
    return { categories: [] }
  }
}

export async function getProducts(filters: any = {}) {
  try {
    const payload = {
      limit: 20,
      offset: 0,
      orderBy: [{ sort: 'ASC', colId: 'price' }],
      filters
    }

    const response = await fetch(`${API_URL}/api/products_user/filterProductsNew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store' // 🔥 Important
    })

    if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(error)
    return { variants: { rows: [] } }
  }
}


export async function getsearchProducts(filters: any = {}) {
  try {
    console.log('📡 Fetching products with filters:', filters)
    
    const payload = {
      limit: 20,
      offset: 0,
      orderBy: [{ sort: "ASC", colId: "price" }],
      filters: filters
    }
    
    const response = await fetch(`${API_URL}/api/products_user/searchProducts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data
  } catch (error) {
    return { variants: { rows: [] } }
  }
}

// Add a new function for subcategory filtering
export async function getProductsBySubcategory(subcategoryId: number) {
  return getProducts({
    category_id: subcategoryId // Adjust based on your API
    // OR if your API uses different field names:
    // subcategory_id: subcategoryId,
    // parent_id: subcategoryId
  })
}

// Search products by keyword
export async function searchProducts(searchTerm: string, filters: any = {}) {
  try {
    console.log('🔍 Searching products with term:', searchTerm)
    
    // Create search payload
    const payload = {
      limit: "50",
      offset: 0,
      orderBy: [{ sort: "ASC", colId: "company" }],
      filters: {
        ...filters,
        // Add search filter - adjust field names based on your API structure
        search: searchTerm,
        // Or if your API expects specific search fields:
        // sku: searchTerm,
        // title: searchTerm,
        // name: searchTerm
      }
    }
    
    console.log('📦 Search Payload:', JSON.stringify(payload, null, 2))
    
    const response = await fetch(`${API_URL}/api/products_user/filterProductsNew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    
    console.log('📊 Search response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Search results received, count:', data.variants?.rows?.length || 0)
    
    return data
    
  } catch (error) {
    console.error('❌ Error searching products:', error)
    // Return empty structure instead of throwing
    return { variants: { rows: [] } }
  }
}

// Alternative: Search products using a dedicated search endpoint (if available)
export async function searchProductsDedicated(searchTerm: string, categoryId?: number) {
  try {
    console.log('🔍 Using dedicated search for term:', searchTerm)
    
    const payload = {
      searchTerm: searchTerm,
      limit: 50,
      offset: 0,
      ...(categoryId && { category_id: categoryId }) // Optional category filter
    }
    
    // Try dedicated search endpoint first, fall back to filter endpoint
    const endpoint = `${API_URL}/api/products_user/search`; // Adjust endpoint if different
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    
    // If dedicated endpoint doesn't exist, fall back to filterProductsNew
    if (!response.ok && response.status === 404) {
      console.log('⚠️ Dedicated search endpoint not found, falling back to filterProductsNew')
      return searchProducts(searchTerm, categoryId ? { category_id: categoryId } : {})
    }
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Dedicated search results:', data)
    return data
    
  } catch (error) {
    console.error('❌ Error in dedicated search:', error)
    // Fall back to filterProductsNew
    return searchProducts(searchTerm, categoryId ? { category_id: categoryId } : {})
  }
}

// Transform API product for UI
export function transformProduct(apiProduct: any) {
  // Parse title JSON if it exists
  let titleData = null;
  if (apiProduct.title && typeof apiProduct.title === 'string') {
    try {
      // titleData = JSON.parse(apiProduct.title);
      titleData = apiProduct.title;
    } catch (error) {
      console.error('Error parsing title:', error);
    }
  }

  return {
    id: apiProduct.id,
    price: apiProduct.price,
    sale_price: apiProduct.sale_price,
    stock: apiProduct.stock,
    sku: apiProduct.sku,
    size: apiProduct.size,
    title: apiProduct.title,
    displayTitle: apiProduct.displayTitle,
    images: apiProduct.images || [],
    primary_image: apiProduct.primary_image,
    
    // Derived fields
    name: titleData?.name || apiProduct.sku || `Product ${apiProduct.id}`,
	product_name: apiProduct.product_name || '',
    brand: titleData?.company_id || 'Unknown Brand',
    description: titleData?.materials ? `Material: ${titleData.materials}` : 'Premium product',
    rating: 4.5,
    category: 'general',
  };
}

// Get product by ID
export async function getProductById(productId: string) {
  try {
    const response = await fetch(`${API_URL}/api/products_user/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: any) {
  return getProducts({
    category_id: categoryId
  });
}

// Get products with pagination
export async function getProductsWithPagination(limit: number = 50, offset: number = 0, filters: any = {}) {
  try {
    const payload = {
      limit: limit.toString(),
      offset: offset,
      orderBy: [{ sort: "ASC", colId: "company" }],
      filters: filters
    };
    
    const response = await fetch(`${API_URL}/api/products_user/filterProductsNew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products with pagination:', error);
    return { variants: { rows: [], totalCount: 0 } };
  }
}

export async function userRegister(form: any) {
  try {
    const response = await fetch(`${API_URL}/api/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await response.json(); // ✅ ALWAYS parse JSON

    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
}

export async function loginUser(form: any) {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await response.json(); // ✅ ALWAYS parse JSON

    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
}
export async function updateUser(form: any) {
  try {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('user');
    const formData:any = JSON.parse(userId ?? '')
    let dataUser:any = {id: formData?.id, address: form?.form?.address, pincode: form?.form?.pincode};
    const response = await fetch(`${API_URL}/api/users/userupdate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataUser),
    });

    const data = await response.json(); // ✅ ALWAYS parse JSON

    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
}

export async function createOrder(orderPayload:any){
  try {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('user');
    const response = await fetch(`${API_URL}/api/order_place/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({orderDetails: orderPayload}),
    });

    const data = await response.json(); // ✅ ALWAYS parse JSON

    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
}

export async function getOrders(userid:any){
  try {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('user');
    const response = await fetch(`${API_URL}/api/order_place/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({userid: userid}),
    });

    const data = await response.json(); // ✅ ALWAYS parse JSON

    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
}

export async function userOrders(form: any) {
  try {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('user');
    const formData:any = JSON.parse(userId ?? '')
    let dataUser:any = {id: formData?.id, address: form?.form?.address, pincode: formData.pincode};
    const response = await fetch(`${API_URL}/api/orders/userOrders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataUser),
    });

    const data = await response.json(); // ✅ ALWAYS parse JSON

    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
}

export async function brandList() {
  try {
    const response = await fetch(`${API_URL}/api/search/brandlist`);

    const data = await response.json(); // ✅ ALWAYS parse JSON

    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
}

export const updateUserAddress = async (formData:any) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/users/updatenew`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })
        const data = await response.json(); // ✅ ALWAYS parse JSON
    if (!response.ok) {
      // ✅ send backend error to frontend
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    return { error: 'Something went wrong' };
  }
};