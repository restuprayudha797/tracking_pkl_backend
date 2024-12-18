import express from 'express';
import { Register, getAllUser, Login, Logout } from '../controllers/Users.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';




const router = express.Router();

router.post('/api/v1/auth/register', Register);
router.post('/api/v1/auth/login', Login);
router.get('/api/v1/auth/getRefreshToken', refreshToken);
router.delete('/api/v1/auth/logout', Logout);
router.get('/api/v1/getAllUser', verifyToken, getAllUser);

export default router;



// backup ======================================================================================================
// import express from 'express';
// import { getUsers, Register, Login, Logout } from '../controllers/Users.js';
// import { verifyToken } from '../middleware/VerifyToken.js';
// import { refreshToken } from '../controllers/RefreshToken.js';


// const router = express.Router();

// router.get('/users', verifyToken, getUsers);
// router.post('/users', Register);
// router.post('/login', Login);
// router.get('/token', refreshToken);
// router.delete('/logout', Logout);

// export default router;