import gql from 'graphql-tag';

export const SELF = gql`
  query self {
    self {
      _id
      username
      email
      password
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`