import Address from "../models/address.js";

//add address : /api/address/aadd-address


export const addAddress = async (req,res)=>{
    try {
        const {address , userId} = req.body;
        await Address.create({...address, userId})
        return res.json({success: true , message: "Address added successfully"})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false , message: error.message});
    }
}

//Get Address: /api/address/get

export const getAddress = async(req , res)=>{
    try {
         const userId = req.user.id;
        const addresses= await Address.find({userId})
        return res.json({success: true , addresses})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false , message: error.message});
    }
}