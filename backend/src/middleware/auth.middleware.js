import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Import the User model

export const protectRoute = async (req, res, next) => {
    try{
        // to use res.cookies, we need to use cookie-parser middleware in index.js that will allow us to parse cookies from the request headers
        const token=req.cookies.jwt; // Extract the JWT token from cookies
        if(!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        // Verify the token by decoding it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // jwt.verify() is used to verify the token using the secret key. If the token is valid, it returns the decoded payload (which contains the userId in this case).
        // If the token is invalid or expired, it will throw an error
        if(!decoded)
        {
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Find the user by ID and exclude the password field

        // If the user is not found, return a 404 error
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach the user to the request object for use in subsequent middleware or route handlers in easy language it means we are attaching the user object to the request object so that we can access it in the next middleware or route handler
        req.user = user;
        next(); // Call the next middleware or route handler


    }catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}