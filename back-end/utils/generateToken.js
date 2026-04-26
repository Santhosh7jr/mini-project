import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({id, role}, "secretkey", {
    expiresIn : "7d",
  });
};

export default generateToken;