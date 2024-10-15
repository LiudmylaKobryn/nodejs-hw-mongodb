import { contactsModel } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = contactsModel.find();
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  const contactsCount = await contactsModel
    .find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await contactsModel.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactsModel.create(payload);
  return contact;
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const newResult = await contactsModel.findOneAndUpdate(
    { _id: contactId, userId },
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

export const deleteContactById = async (contactId, userId) => {
  const contact = await contactsModel.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
