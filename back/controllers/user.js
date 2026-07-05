const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const DBconnect = require('../DBconnect');

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const REFRESH_COOKIE_NAME = 'refreshToken';

const getAccessSecret = () => process.env.SecretOrKey;
const getRefreshSecret = () => process.env.REFRESH_TOKEN_SECRET || process.env.SecretOrKey;

const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

const signAccessToken = (payload) => jwt.sign(payload, getAccessSecret(), { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
const signRefreshToken = (payload) => jwt.sign(payload, getRefreshSecret(), { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  delete user.refreshTokenHash;
  return user;
};


module.exports = {

  register: async (req, res) => {
    const { name, lastName, email, matricule, password, phone,autonum, district,role,isAdmin,image  } = req.body;
  
    if (!name || !lastName || !email || !matricule || !password || !phone || !autonum || !district || !role) {
      return res.status(400).json({ msg: "Tous les champs sont obligatoires" });
    }
  
    try {
      // Vérifier si l'utilisateur existe
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        return res.status(400).json({ msg: "L'email existe déjà" });
      }

      const existingUserMatricule = await User.findOne({ matricule });
      if (existingUserMatricule) {
        return res.status(400).json({ msg: "Le matricule existe déjà" });
      }
  
      // Hacher le mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Créer et enregistrer l'utilisateur
      const newUser = new User({
        name,
        lastName,
        email,
        matricule,
        password: hashedPassword,
        phone,
        autonum,
        district,
        role,
        image,
        isAdmin,
      });
  
      const savedUser = await newUser.save();
  
      res.status(200).json({ msg: "Utilisateur enregistré avec succès", user: savedUser });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error.message);
      res.status(500).json({ msg: "Erreur interne du serveur" });
    }
  },

  login: async (req, res) => {
    const { matricule, password } = req.body;
    const appType = req.headers['app-type']; // "mobile" or "web"
  
    try {
      await DBconnect();
      const searchedUser = await User.findOne({ matricule });
      if (!searchedUser) return res.status(400).send({ msg: "Bad credentials" });
  
      const match = await bcrypt.compare(password, searchedUser.password);
      if (!match) return res.status(400).send({ msg: "Bad credentials" });
  
      // Role-based access restriction
      if (appType === 'mobile' && searchedUser.role !== 'patrouille') {
        return res.status(403).send({ msg: "Access denied. Only patrouille users can use the mobile app." });
      }
  
      if (appType === 'web' && !['securite', 'entretient','superviseur'].includes(searchedUser.role)) {
        return res.status(403).send({ msg: "Access denied. Only securite or maintenance users can use the web app." });
      }
  
      const payload = {
        _id: searchedUser._id,
        name: searchedUser.name,
        role: searchedUser.role,
      };
  
      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken({ _id: searchedUser._id });
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      await User.findByIdAndUpdate(searchedUser._id, { refreshTokenHash });

      res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
  
      res.status(200).send({
        user: sanitizeUser(searchedUser),
        msg: "success",
        token: `Bearer ${accessToken}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Cannot log in. Internal error, Server error" });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME];

      if (!tokenFromCookie) {
        return res.status(401).send({ msg: 'Refresh token missing' });
      }

      let decoded;
      try {
        decoded = jwt.verify(tokenFromCookie, getRefreshSecret());
      } catch (error) {
        return res.status(401).send({ msg: 'Invalid refresh token' });
      }

      const user = await User.findById(decoded._id).select('+refreshTokenHash');
      if (!user || !user.refreshTokenHash) {
        return res.status(401).send({ msg: 'Refresh token is not valid' });
      }

      const isValidStoredToken = await bcrypt.compare(tokenFromCookie, user.refreshTokenHash);
      if (!isValidStoredToken) {
        return res.status(401).send({ msg: 'Refresh token does not match' });
      }

      const accessPayload = {
        _id: user._id,
        name: user.name,
        role: user.role,
      };

      const newAccessToken = signAccessToken(accessPayload);
      const newRefreshToken = signRefreshToken({ _id: user._id });
      const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

      user.refreshTokenHash = newRefreshTokenHash;
      await user.save();

      res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, getRefreshCookieOptions());

      return res.status(200).send({
        msg: 'Token refreshed',
        token: `Bearer ${newAccessToken}`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: 'Cannot refresh token. Internal error' });
    }
  },

  logout: async (req, res) => {
    try {
      const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME];

      if (tokenFromCookie) {
        try {
          const decoded = jwt.verify(tokenFromCookie, getRefreshSecret());
          await User.findByIdAndUpdate(decoded._id, { refreshTokenHash: null });
        } catch (error) {
          // Always clear cookie even if token is invalid/expired.
        }
      }

      res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions());
      return res.status(200).send({ msg: 'Logged out' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: 'Cannot logout. Internal error' });
    }
  },

  current: async (req, res) => {
    res.status(200).send({ user: req.user });
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { password, ...otherUpdates } = req.body;

    try {
      let updateData = { ...otherUpdates };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  },
  getAll: async (req, res) => {
    try {
      const result = await User.find()
      res.send({ response: result, message: "Geting Users successful" })
    } catch (error) {
      res.status(400).send({ message: "Can not get Users" })
    }
  },
  delete: async (req, res) => {
    try {
      const result = await User.findByIdAndDelete({ _id: req.params.id });
      res.send("user deleted");
    } catch (error) {
      res.send({ msg: "cannot delete user" });
    }
  }

}