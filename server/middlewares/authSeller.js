import jwt from 'jsonwebtoken'

const authSeller = async (req, resizeBy, next) =>{
    const { sellerToken } = req.cookies;

    if(!sellerToken){
        return resizeBy.json({success: false, message: 'Not authorized'});
    }

    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
        if(tokenDecode.email === process.env.SELLER_EMAIL){
            next();
        }else{
            return res.json({scuuess: false, message: 'Not Authorized'});
        }
    } catch (error) {
        res.json({scuuess: false, message: error.message});
    }
}

export default authSeller;