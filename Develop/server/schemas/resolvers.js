const { User, Books } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('books');
    },

    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('books');
    },

    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('books');
        return userData;
      }
      throw new AuthenticationError('You are not logged in!');
    },

    books: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Book.find(params);
    },

    books: async (parent, { bookId }) => {
      return Book.findOne({ bookId });
    }
  },

  Mutation: {
    
  }
};

module.exports = resolvers;