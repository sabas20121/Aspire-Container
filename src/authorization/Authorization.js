function authorize(req, res, next) {
    // Add your authorization logic here
    // For demonstration purposes, we'll assume authorization is successful
    console.log('Authorization successful');
    next();
  }
  
  module.exports = authorize;