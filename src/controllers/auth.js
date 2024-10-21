import {
  logoutUser,
  registerUser,
  loginUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { refreshUserSession } from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
      secure: true,
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
      secure: true,
    });

    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId, req.cookies.refreshToken);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    if (!sessionId || !refreshToken) {
      return res.status(400).json({
        status: 400,
        message: 'Session not found',
      });
    }
    const session = await refreshUserSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    next(error);
  }
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPassword(req.body);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
