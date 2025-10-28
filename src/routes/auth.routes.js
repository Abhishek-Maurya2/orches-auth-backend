const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

router.post(
  '/register',
  validate(authValidation.register),
  authController.register,
);
router.post('/login', validate(authValidation.login), authController.login);
router.post(
  '/logout',
  validate(authValidation.logout),
  authController.logout,
);
router.post(
  '/refresh-tokens',
  validate(authValidation.refresh),
  authController.refresh,
);
router.get('/me', auth, authController.getCurrentUser);
router.put(
  '/me',
  auth,
  validate(authValidation.updateProfile),
  authController.updateProfile,
);
router.post(
  '/password/forgot',
  validate(authValidation.forgotPassword),
  authController.requestPasswordReset,
);
router.post(
  '/password/reset',
  validate(authValidation.resetPassword),
  authController.resetPassword,
);

module.exports = router;
