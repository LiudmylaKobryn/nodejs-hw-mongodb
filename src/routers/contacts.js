import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValid.js';

const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

contactRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIdController),
);

export default contactRouter;
