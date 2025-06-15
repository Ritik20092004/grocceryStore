import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    const navigate = useNavigate();
    const [user , setUser] = useState(null)
    const [isSeller , setIsSeller] = useState(false)
    const [showUserLogin , setShowUserLogin]=useState(false);
    const [products , setProducts ] = useState([]);
    const currency = import.meta.env.VITE_CURRENCY;
    const [cartItems , setCartItems] = useState({});
   
    const [searchQuery , setSearchQuery ] =useState({});

    //fetch seller status
    const fetchSeller = async ()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth')
            if(data.success){
                setIsSeller(true)
            }
            else{
               setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }
    
    //fetch user auth  status  , user data and cart items
    const fetchUser = async ()=>{
        try {
            const {data} = await axios.get('/api/user/is-auth')
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
           else{
            setUser(null)
           }
        } catch (error) {
            setUser(null)
        }
    }
    //fetch all products
    const fetchProducts = async ()=>{
        try {
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
        
    },[])
    
    //update database cart items
    useEffect(()=>{
      const updateCart = async ()=>{
        try {
            const {data} = await axios.post('/api/cart/update',{userId:user._id,cartItems})
            if(!data.success){
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
      }
      if(user){
        updateCart()
      }
    },[cartItems])

    const getCartCount = ()=>{
        let totalCount=0;
        for(const item in cartItems){
            totalCount += cartItems[item]
        }
        return totalCount;
    }

    const getCartAmount = ()=>{
        let amount=0;
        for(const item in cartItems){
            let itemInfo = products.find((product)=> product._id===item);
            if(cartItems[item] > 0){
                amount+=itemInfo.offerPrice*cartItems[item];
            }
        }
        return Math.floor(amount*100)/100;
    }

    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems)
        if(cartData[itemId]){
            cartData[itemId] +=1;
        }
        else{
            cartData[itemId]=1;
        }
        
        toast.success("Added to Cart")
        setCartItems(cartData);
    }
 
    const updateCartItem = (itemId ,quantity)=>{
      let cartData =structuredClone(cartItems);
      cartData[itemId] = quantity;
      
      toast.success("Cart Updated");
      setCartItems(cartData);
    }

    const removeFromCart = (itemId )=>{
        let cartData =structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -=1;
            if(cartData[itemId]===0){
                delete cartData[itemId]
            }
        }
        
       
        toast.success("Removed from Cart");
        setCartItems(cartData);
      }

    const value={navigate , user , setUser, isSeller ,setIsSeller , showUserLogin ,setShowUserLogin ,products ,currency ,addToCart , updateCartItem , 
        removeFromCart , cartItems , searchQuery , setSearchQuery, getCartAmount , getCartCount ,axios ,fetchProducts ,setCartItems
    }
   return <AppContext.Provider value={value}>
       {children}
   </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext);
}