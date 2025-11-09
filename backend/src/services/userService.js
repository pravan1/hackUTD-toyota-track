import User from '../models/User.js';

export const findOrCreateUser = async ({ auth0Id, email, name }) => {
  if (!auth0Id) throw new Error('auth0Id is required');

  let user = await User.findOne({ auth0Id });

  if (!user) {
    user = await User.create({
      auth0Id,
      email,
      name
    });
  } else if ((email && user.email !== email) || (name && user.name !== name)) {
    user.email = email ?? user.email;
    user.name = name ?? user.name;
    await user.save();
  }

  return user;
};

