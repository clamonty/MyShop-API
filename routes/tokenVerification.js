const jwt = require('jsonwebtoken');

/**
 * Function to verify if jwt token is valid or invalid
 */
const verifyToken = (req, res, next) => {
    // Get token from request header
    const authHeader = req.headers.token;

    // If there is a header token
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        // Verify the token
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            // If error with token, send error
            if(err)
                res.status(403).json("Invalid token");
            // Else assign request.user to the jwt's user
            else {
                req.user = user;
                next();
            }

        });
    } 
    // If there is no request header
    else {
        return res.status(401).json("Error with user authentication");
    }
}

/**
 * Function to verify if user has valid ID or is an admin
 */
const verifyTokenAndAuthorization = (req, res, next) => {
    // Verify valid jwt token
    verifyToken(req, res, () => {
        // If id matches or user is admin, continue
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Access forbidden");
        }
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin)
            next();
        else
            res.status(403).json("User does not have admin priviledges");
    });
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin 
};