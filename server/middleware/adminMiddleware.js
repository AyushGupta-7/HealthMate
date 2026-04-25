// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};