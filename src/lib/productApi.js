// import axios from 'axios';
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const api = axios.create({
//     baseURL: BASE_URL, // Replace with production URL when deploying
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export const getProductBySlug = async (slug) => {
//     const slugData = slug;

//     try {
//         const res = await api.post('/products_user/slug', {
//             filters: { slug: slugData },
//         });
//         return res.data[0];
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return null; // or throw error
//     }
// };

// export const getCategorySlug = async (slug) => {
//     const slugData = slug;

//     try {
//         const res = await api.post('/products_user/categorySlug', {
//             filters: { slug: slugData },
//         });
//         return res.data[0];
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return null; // or throw error
//     }
// };

// export const fetchProductDataApi = async (id) => {
//     const slug = decodeURIComponent(id);

//     try {
//         const res = await api.post('/products_user/detail-page', {
//             filters: { slug },
//         });
//         if (res.data && Array.isArray(res.data) && res.data.length > 0) {
//             return res.data[0]; // Safely access first product
//         } else {
//             console.warn('No product found for slug:', slug);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         return null;
//     }
// }

export const orderPlace = async (orderDetails) => {
    
    // try {
    //     const res = await api.post('/order_place/new', {
    //         orderDetails,
    //     });
    //    return res.data;
    // } catch (error) {
    //     console.error('Error fetching user data:', error);
    //     return null;
    // }
}
// export const orderPlacecasefree = async (orderDetails) => {
    
//     try {
//         const res = await api.post('/order_place/casefree', {
//             orderDetails,
//         });
//        return res.data;
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         return null;
//     }
// }

// export const verifyOrder = async (orderDetails) => {
    
//     try {
//         const res = await api.post(`/order_place/verifyOrder?order_id=${orderDetails}`, {
//             orderDetails,
//         });
//        return res.data;
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         return null;
//     }
// }

// export const getOrders = async (userid) => {
    
//     try {
//         const res = await api.post('/order_place/all', {
//             userid: userid,
//         });
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return null; // or throw error
//     }
// };

// export const verifyRefUser = async (data) => {
    
//     try {
//         const res = await api.post('/order_place/verifyReffUser', {
//             data,
//         });
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return null; // or throw error
//     }
// };

// export const getReferalOrders = async (data) => {
    
//     try {
//         const res = await api.post('/order_place/referalProducts', {
//             data,
//         });
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return null; // or throw error
//     }
// };


export const calculateShipping = async (data) => {
    
    // try {
    //     const res = await api.post('/order_place/calculateShipping', {
    //         data,
    //     });
    //     return res.data;
    // } catch (error) {
    //     console.error('Error fetching product by slug:', error);
    //     return null; // or throw error
    // }
};

export const checkPincode = async (pincode) => {
    
    // try {
    //     const res = await api.post('/order_place/checkpincode', {
    //         pincode,
    //     });
    //     return res.data;
    // } catch (error) {
    //     console.error('Error fetching product by slug:', error);
    //     return null; // or throw error
    // }
};

// export const getReferal = async (code) => {
    
//     try {
//         const res = await api.post('/referral_webpage/verifyCode', {
//             referal: code,
//         });
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return null; // or throw error
//     }
// };

// export const createUser = async (formData) => {
    
//     try {
//         const res = await api.post('/users/create', formData);
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return error?.response?.data; // or throw error
//     }
// };

// export const createReview = async (formData) => {
    
//     try {
//         const res = await api.post('/reviews/create', formData);
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return error?.response?.data; // or throw error
//     }
// };

// export const getReview = async (productId) => {
    
//     try {
//         const res = await api.get(`/reviews/product/${productId}`);
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return error?.response?.data; // or throw error
//     }
// };

// export const getAverageRating = async (productId) => {
    
//     try {
//         const res = await api.get(`/reviews/average/${productId}`);
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return error?.response?.data; // or throw error
//     }
// };


// export const updateUserAddress = async (formData) => {
//     try {
//         const res = await api.put('/users/updatenew', formData);
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return error?.response?.data; // or throw error
//     }
// };

// export const loginUser = async (formData) => {
    
//     try {
//         const res = await api.post('/users/login', formData);
//         return res.data;
//     } catch (error) {
//         console.error('Error fetching product by slug:', error);
//         return error?.response?.data; // or throw error
//     }
// };

// export const searchProduct = async (searchTerm) => {
    
//     try {
//         const res = await api.post(`products?search=${searchTerm}`);
//         return res.data;
//     } catch (error) {
//         return error?.response?.data; // or throw error
//     }
// };

// // Request Interceptor
// api.interceptors.request.use(
//   (config) => {
// 	  config.metadata = { startTime: new Date() };

//     let token = null;
//     if (typeof window !== "undefined") {
//       token = localStorage.getItem("user_data");
// 	  //if(token != null || token != ''){
// 		//  token = JSON.parse(token);
// 	  //}
// 	  if (token !== null && token !== '' && token != "undefined" && token != undefined) {
// 		  token = JSON.parse(token);
// 		}
//     }
//     if (token?.token != null) {
//       config.headers.Authorization = `Bearer ${token?.token}`;
//     } else {
//       config.headers.Authorization = `Bearer 'testYuukkm'`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor
// api.interceptors.response.use(
//   (response) => {
// 	  const endTime = new Date();
//     const duration = endTime - response.config.metadata.startTime;
//     console.log(`API: ${response.config.url} took ${duration} ms`);

//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // For example, redirect to login page
//       // error.response.data.message === "Invalid email or password" ? '' : window.location.href = "/";
      
//       // window.location.href = "/";
//     }
//     // errorToast(error?.message);
//     return Promise.reject(error);
//   }
// );