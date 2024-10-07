import { contactsModel } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await contactsModel.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactsModel.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const newResult = await contactsModel.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!newResult || !newResult.value) return null;

  return {
    contact: newResult.value,
    isNew: Boolean(newResult?.lastErrorObject?.upserted),
  };
};

export const deleteContactById = async (contactId) => {
  const contact = await contactsModel.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
