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
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user};
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      
      return { token, user };
    },

    addBook : async (parent, args, context) => {
      if (context.user) {
        const book = await Book.create({ ...args, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { books: book.bookId } },
          { new: true }
        )

        return book;
      }

      throw new AuthenticationError('You are not logged in!');
    },

    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedBook = await Book.findByIdAndUpdate({ bookId });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { books: bookId } },
          { new: true }
        )

        return book;
      }

      throw new AuthenticationError('You are not logged in!');
    }
  }
};

module.exports = resolvers;