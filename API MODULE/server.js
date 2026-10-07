const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Define GraphQL Schema
const schema = buildSchema(`
    type Query {
        message: String
    }
`);

// Define resolver
const root = {
    message: () => {
        return "Hello Students! Welcome to GraphQL API";
    }
};

// Create GraphQL endpoint
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);

// Start Server
app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000/graphql");
});