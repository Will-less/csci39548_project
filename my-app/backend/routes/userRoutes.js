import express from 'express'
import { getUser, createUser, authUser, updateText, deleteUser, login, overwriteText } from '../controllers/userController.js';

const router = express.Router();
router.get('/:id', getUser);
router.patch('/save', authUser, updateText);
router.patch('/overwrite/:textId', authUser, overwriteText);
router.post('/register', createUser);
router.delete('/delete/:id', deleteUser);
router.post('/login', login);

export default router;
