const router = require(`express`).Router()

const userController = require('./controllers/user.controller');
const contactController = require('./controllers/contact.controller');
const { authenticate,isAdmin,isUser } = require('./middleware/auth.middleware');

//Authentication Routes
router.post('/api/register', userController.registerUser);
router.post('/api/login', userController.login);

//update his profile
router.put('/api/updateProfile', authenticate, userController.updateUserProfile);


//These are protected routes enabled only for admin 

//fetch all users data to admin
router.get('/api/admin/getUserInfo', authenticate, isAdmin, userController.getUserInfo);

//fetch user's contacts list number
router.get('/api/admin/getUserContactCount', authenticate, isAdmin, contactController.getUserContactsCount);

//delete user contact
router.delete('/api/admin/deleteUser', authenticate, isAdmin, userController.deleteUser)

//These protected routes are enable only for normal users

//create new contact
router.post('/api/user/createContact', authenticate, isUser,contactController.saveContact);

//save contacts in bulk
router.post('/api/user/createContactBulk', authenticate, isUser, contactController.addContactBulk)

//fetch details of single contact
router.get(
  '/api/user/getSingleContactDetail',
  authenticate,
  contactController.getSingleContactDetail
)

//Update details of a contact
router.put('/api/user/updateContact', authenticate,isUser, contactController.updateContact);

//Fetch his all contacts details
router.get('/api/user/getAllContacts', authenticate,isUser, contactController.getUserContacts);

//delete contact
router.delete('/api/user/deleteContact', authenticate,isUser, contactController.deleteUserContact);

module.exports = router
