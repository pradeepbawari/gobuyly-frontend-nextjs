'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { userRegister } from '@/lib/api'
import AddressForm, { Address } from '@/components/forms/AddressForm'

export default function RegisterPage() {
  const router = useRouter()
  const { user, login } = useAuth()

  const [address, setAddress] = useState<Address>({
    name: '',
    mobile_number: '',
    email: '',
    password: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState('')

  // Called by AddressForm whenever inputs or pincode change
  const handleAddressChange = (updatedAddress: Address, valid: boolean) => {
    setAddress(updatedAddress)
    setIsEnabled(valid)
  }

  const onSubmitHandler = async () => {
    if (!isEnabled) return

    try {
      const existingAddresses = Array.isArray(user?.address)
        ? user.address
        : []

      const updatedAddresses = [...existingAddresses, address]

      const payload = {
        form: {
          ...address,
          address: updatedAddresses,
        },
      }

      const res = await userRegister(payload)

      if (res?.error) {
        setError(res.error)
        return
      }

      login(res.user)
      router.push('/cart')
    } catch (err) {
      console.error('Add address failed:', err)
      setError('Unable to save address')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">New Registration</h1>

      <AddressForm value={address} onChange={handleAddressChange} page='register' />

      {error && (
        <p className="text-red-600 text-sm mt-3">{error}</p>
      )}

      <button
        onClick={onSubmitHandler}
        disabled={!isEnabled}
        className={`max-w-sm w-full mt-6 py-3 text-white uppercase ${
          isEnabled
            ? 'bg-orange-600 hover:bg-orange-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Save address
      </button>
    </div>
  )
}


// // 'use client';

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { userRegister } from '@/lib/api';

// // export default function RegisterPage() {
// //   const router = useRouter();
// //   const [form, setForm] = useState({
// //     name: '',
// //     email: '',
// //     password: '',
// //     mobile_number: '',
// //     address: '',
// //     gstin: '',
// //     pincode: '',
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   setLoading(true);

// //   try {
// //      const addressArray = [
// //       {
// //         fullName: form.name,
// //         phoneNumber: form.mobile_number,
// //         pincode: form.pincode,
// //         area: form.address,
// //       },
// //     ]

// //     const payload = {
// //       form: {
// //         ...form,
// //         address: addressArray,
// //       },
// //     }

// //     const result = await userRegister(payload)
// //     setLoading(false);

// //     if (result.error) {
// //       setError(result.error)
// //     } else {
// //       setError(result.message)
// //       const time = setTimeout(() => {
// //         router.push('/login');
// //       }, 600);      
// //       return () => clearTimeout(time); 
// //     }
// //   } catch (err) {
// //     setLoading(false);
// //   }
// // };


// //   return (
// //     <div className="min-h-screen flex items-center justify-center from-emerald-500 to-teal-600 px-4">
// //       <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
// //         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
// //           Create Account 🚀
// //         </h2>
// //       {error && <div className='p5 text-red-600 mb-3'>{error}</div>}
// //         <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
// //           <input
// //             name="name"
// //             placeholder="Full Name"
// //             required
// //             onChange={handleChange}
// //             className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
// //           />

// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             required
// //             onChange={handleChange}
// //             className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
// //           />

// //           <input
// //             type="password"
// //             name="password"
// //             placeholder="Password"
// //             required
// //             onChange={handleChange}
// //             className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
// //           />

// //           <input
// //             name="mobile_number"
// //             placeholder="Phone Number"
// //             onChange={handleChange}
// //             className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
// //           />
// //           <input
// //             name="pincode"
// //             type="number"
// //             placeholder="Pincode"
// //             onChange={handleChange}
// //             className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
// //           />

// //           <input
// //             name="gstin"
// //             placeholder="GST Number (Optional)"
// //             onChange={handleChange}
// //             className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
// //           />

// //           <input
// //             name="address"
// //             placeholder="Shipping address"
// //             required
// //             onChange={handleChange}
// //             className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
// //           />

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition mt-2"
// //           >
// //             {loading ? 'Creating account...' : 'Register'}
// //           </button>
// //         </form>

// //         <p className="text-sm text-center text-gray-500 mt-6">
// //           Already have an account?{' '}
// //           <a href="/login" className="text-teal-600 font-semibold">
// //             Login
// //           </a>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }


// 'use client'
// // import { assets } from "@/assets/assets";
// // import Navbar from "@/components/Navbar";
// // import Footer from "@/components/Footer";
// // import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// // import { useAppContext } from "@/context/AppContext";
// import { updateUserAddress } from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from 'next/navigation'
// import HeaderPincodeChecker from "@/components/layout/HeaderPincodeChecker";

// const AddAddress = () => {
//     // const { router, userData, updateUserData } = useAppContext()
//     const { user, isAuthenticated, login } = useAuth();
//     const [error, setError] = useState('');
//   const [succes, setSucces] = useState('');
//   const [isEnabled, setIsEnabled] = useState(false);
//     const [isAddressEnabled, setIsAddressEnabled] = useState(false);
//     const formRef = useRef<HTMLFormElement>(null);
//     const router = useRouter()
//     const [pincode, setPincode] = useState('');

//     const [address, setAddress] = useState({
//         fullName: '',
//         phoneNumber: '',
//         pincode: '',
//         area: '',
//         city: '',
//         state: '',
//     })

//     const onSubmitHandler = async (e:any) => {
//         try {
//         e.preventDefault();
//         e.preventDefault();
//         const isFormValid = formRef.current?.checkValidity();
//         if (!isFormValid) {
//             return (setIsEnabled(true),
//             setIsAddressEnabled(true))
//         } else {
//             setIsAddressEnabled(false)
//             setIsEnabled(false)
//         if(user?.address){
//             // const token = localStorage.getItem('token');
//           let data = user?.address
//           if (data.length > 0) {
//             data.push(address)
//             user.address = data
//             const userDetails = {id: user?.id, userData: user};
//             const res = await updateUserAddress(userDetails);
//                 if(res?.error) return setError(`${res?.error}`); 
//                 setError('');
//                 login(res.user)
//             router.push("/cart");
//           }
//         }
//     }
//         } catch(err){
//             console.log(err)
//         }
//     }

//     const handlePincode = (e:any) => {
//         setIsEnabled(e.isValid)
//         setPincode(e.pincode)
//     }

//     useEffect(() => {
//   if (pincode) {
//     setAddress(prev => ({ ...prev, pincode }))
//   }
// }, [pincode])


//     return (
//         <>
//             {/* <Navbar /> */}
//             <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
//                 {/* {JSON.stringify(userData)} */}
//                 <form className="w-full" ref={formRef} >
//                     <p className="text-2xl md:text-3xl text-gray-500">
//                         Add Shipping <span className="font-semibold text-orange-600">Address</span>
//                         {error}
//                     </p>
//                     <div className="space-y-3 max-w-sm mt-10">
//                         <input
//                             className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
//                             type="text"
//                             placeholder="Full name"
//                             onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
//                             value={address.fullName}
//                         />
//                         <input
//                             className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
//                             type="text"
//                             placeholder="Phone number"
//                             onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
//                             value={address.phoneNumber}
//                         />
//             <textarea
//                             className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
//                             type="text"
//                             rows={4}
//                             placeholder="Address (Area and Street)"
//                             onChange={(e) => setAddress({ ...address, area: e.target.value })}
//                             value={address.area} required
//                         ></textarea>
//                         <div className="flex space-x-3">
//                             <input
//                                 className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
//                                 type="text"
//                                 placeholder="City/District/Town"
//                                 onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                                 value={address.city} required
//                             />
//                             <input
//                                 className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
//                                 type="text"
//                                 placeholder="State"
//                                 onChange={(e) => setAddress({ ...address, state: e.target.value })}
//                                 value={address.state} required
//                             />
//                         </div>
//             <div className="flex gap-4">
//                             <HeaderPincodeChecker onChange={handlePincode} />
//             {/* <div className="flex gap-4 flex-col">
//                         <input
//                             className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
//                             type="number"
//                             placeholder="Pin code"
//                             onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
//                             value={address.pincode}
//                         />
//             <span className="text-green-600 text-md">{succes}</span>
//             </div>
//             <button onClick={pincodeHandler} className="h-11 bg-orange-600 text-white px-3 py-1 hover:bg-orange-700">Check services</button> */}
            
//             </div>
//                         {isAddressEnabled && (<div className="text-sm text-red-600 border border-red-300 w-full py-1 px-2 rounded-md">
//                             <span>* Fill all the fields</span>
//                         </div>)}
//                     </div>
//                     <button type="submit" onClick={onSubmitHandler} 
//                     disabled={!isEnabled} 
//                     className={`${!isEnabled ? 'bg-gray-300 disabled' : 'hover:bg-orange-700 bg-orange-600'} max-w-sm w-full mt-6 text-white py-3 uppercase`}>
//                         Save address
//                     </button>
//                 </form>
//                 {/* <Image
//                     className="md:mr-16 mt-16 md:mt-0"
//                     src={assets.my_location_image}
//                     alt="my_location_image"
//                 /> */}
//             </div>
//             {/* <Footer /> */}
//         </>
//     );
// };

// export default AddAddress;
