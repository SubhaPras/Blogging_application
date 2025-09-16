import jwt from 'jsonwebtoken'
  
const protect = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({
                success : false,
                message : "unauthorised user"
            })
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if(!decode){
            return res.json({
                success : false,
                message : "invalid user"
            })
        }
        req.id = decode.userId;
        next()
    } catch (error) {
        console.log(error);
        
    }
}

export default protect