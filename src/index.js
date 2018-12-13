import express from "express"
import { ApolloServer, gql} from "apollo-server-express"
import cors from 'cors';

const app = express()

app.use(cors())


let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch'
  },
  2: {
    id: '2',
    username: 'Dave Davids'
  }
}

const me = users[1]

//! means it is a non nullable field
const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }
  type User {
    id: ID! 
    username: String!
  }
`


// resolvers are used to return data for fields from the schema
// Resolvers are functions that resolve data for your GraphQL fields in the schema.

// In JavaScript, the resolvers are grouped in a JavaScript object, often called a resolver 
// map. Each top level query in your Query type has to have a resolver. Now, we’ll resolve things on a per-field level.
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id]
    },
    me: (parent, args, { me }) => {
      return me;
    },
  },

  //everytime you resolve a User do this
  // User: {
  //   username: user => `${user.firstname} ${user.lastname}`
  // }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // The context argument is the third argument in the resolver function used to inject dependencies from the outside to the resolver function. 
  context: {
    me: users[1]
  }
})
server.applyMiddleware({ app, path: "/graphql" })
app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql")
})
