const router = require(`express`).Router()
const userController = require('./controllers/user.controller');
const contactController = require('./controllers/contact.controller');
const { authenticate,isAdmin,isUser } = require('./middleware/auth.middleware');

// router.get('/api/getAllUser', userController.getUserList);
router.post('/api/register', userController.registerUser);
router.post('/api/login', userController.login);


router.put('/api/updateProfile',authenticate, userController.updateUserProfile);
router.get('/api/admin/getUserInfo', authenticate, isAdmin, userController.getUserInfo);
router.get('/api/admin/getUserContactCount', authenticate, isAdmin,
    contactController.getUserContactsCount);
router.delete('/api/admin/deleteUser',authenticate, isAdmin,userController.deleteUser)

router.post('/api/user/createContact', authenticate, isUser,contactController.saveContact);
router.post('/api/user/createContactBulk', authenticate,isUser,contactController.addContactBulk)
router.get(
  '/api/user/getSingleContactDetail',
  authenticate,
  contactController.getSingleContactDetail
)

router.put('/api/user/updateContact', authenticate,isUser, contactController.updateContact);

router.get('/api/user/getAllContacts', authenticate,isUser, contactController.getUserContacts);

router.delete('/api/user/deleteContact', authenticate,isUser, contactController.deleteUserContact);

module.exports = router
