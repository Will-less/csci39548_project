import express from 'express'
import { getUser, createUser, updateUser } from '../controllers/userController.js';

const router = express.Router();
router.route('/:id').get(getUser).patch(updateUser);
router.post('/', createUser);

export default router;
