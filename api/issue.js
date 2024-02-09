const { UserInputError } = require('apollo-server-express');
const { getNextSequence,getDB } = require('./db.js')

async function issueList(_,{status}){
    const db = getDB();
    const filter = {};
    if(status) filter.status = status;
    const issues = await db.collection('issues').find(filter).toArray();
    return issues;
}

function validate(issue){
    const errors=[];
    if (issue.title.length<3){
        errors.push('The "title" of the issue must be atleast 3 characters');
    }
    if (issue.status === 'Assigned' && !issue.owner){
        errors.push('The Assigned Issue must have the owner');
    }
    if (errors.length>0){
        throw new UserInputError('Invalid input(s)',{ errors });
    }
}

async function addIssue(_,{issue}){
    const db = getDB();
    validate(issue);
    const newIssue = Object.assign({},issue);
    newIssue.id = await getNextSequence('issues');
    newIssue.created = new Date();
    const result = await db.collection('issues').insertOne(newIssue);
    const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
    return savedIssue;
}

async function get(_,{id}){
    const db = getDB();
    const issue = await db.collection('issues').findOne({id});
    return issue;
}

module.exports={ issueList,addIssue,get };