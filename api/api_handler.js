const fs= require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const about = require('./about.js');
const issue = require('./issue.js');
const GraphQLDate = require('./graphql_date.js');

const resolvers = {
    Query:{
        about: about.getMessage,
        issueList: issue.list,
        issue: issue.get,
    },
    Mutation:{
        setMessage: about.setMessage,
        addIssue: issue.add,
        issueUpdate: issue.update,
        issueDelete: issue.delete,
    },
    GraphQLDate,
}

const apolloServer = new ApolloServer(
    {
        typeDefs: fs.readFileSync('schema.graphql','utf-8'),
        resolvers,
        format_error: (err)=>{
            console.log(err);
            return err;
        }
    }
)

function installHandler(app){
    const enableCors = ( process.env.ENABLE_CORS || 'true' )==='true';
    console.log(`CORS POLICY : ${enableCors}`);
    apolloServer.applyMiddleware({app,path:'/graphql',cors:enableCors});
}

module.exports = installHandler;