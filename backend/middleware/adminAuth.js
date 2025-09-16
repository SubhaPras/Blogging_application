import jwt from "jsonwebtoken";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorised Admin" });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.id = decoded.adminId;
    // console.log("Cookies:", req.cookies);

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAdmin;
