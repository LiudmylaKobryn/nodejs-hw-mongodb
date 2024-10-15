import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email already been used');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  const isAccessTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }

  if (!session) {
    throw createHttpError(401, 'Session token expired or invalid');
  }

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
