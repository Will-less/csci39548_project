import express from 'express'
import { getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();
router.route('/:id').get(getUser).patch(updateUser);
router.post('/register', createUser);
router.delete('/delete/:id', deleteUser);

export default router;
