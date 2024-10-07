import { Router } from 'express';
import contactRouter from './contacts.js';

const router = Router();

router.use('/contacts', contactRouter);

export default router;
