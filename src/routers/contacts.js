import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactRouter.post('/', ctrlWrapper(createContactController));

contactRouter.patch('/:contactId', ctrlWrapper(patchContactController));

contactRouter.delete('/:contactId', ctrlWrapper(deleteContactByIdController));

export default contactRouter;
