const getCurrentUser = async (req, res) => {
     try {
       const { email, subscription } = req.user;
   
       res.json({
         email,
         subscription,
       });
     } catch (error) {
       next(error);
     }
   };
   
   module.exports = getCurrentUser;