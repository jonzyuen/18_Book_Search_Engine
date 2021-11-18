const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type Query {
    self: User
  }

  type Mutation {
    login(email: String, password: String!): Auth
    addUser(username: String, email: String, password: String!): Auth
    saveBook(bookId: String!, title: String!, authors: [String], description: String, image: String, link: String): User
    removeBook(bookId: String): User
  }

  type Auth {
    token: ID!
    user: User!
  }
`;

module.exports = typeDefs