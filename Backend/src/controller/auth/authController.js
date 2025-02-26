import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";

const login = async (req, res) => {
  try {
    //fetching all the data from users table
    if (req.body.email == null) {
      return res.status(500).send({ message: "email is required" });
    }
    if (req.body.password == null) {
      return res.status(500).send({ message: "email is required" });
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(500).send({ message: "user not found" });
    }
    if (user.password == req.body.password) {
      const token = generateToken({ user: user.toJSON() });
      return res.status(200).send({
        data: { access_token: token },
        message: "successfully logged in",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 *  init
 */


const getMe = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware.
    const user = req.user
    console.log(user)
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    // Remove sensitive data
    delete user.password;

    res.status(200).send({
      data: user,
      message: "Successfully fetched current user",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};

export const authController = {
  login,
  getMe,
};
