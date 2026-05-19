import express from 'express'
import { getUser, createUser, authUser, updateUser, deleteUser, login } from '../controllers/userController.js';

const router = express.Router();
router.route('/:id').get(getUser);
router.get('/:id', getUser);
router.patch('/save', authUser, updateUser)
router.post('/register', createUser);
router.delete('/delete/:id', deleteUser);
router.post('/login', login);

export default router;
