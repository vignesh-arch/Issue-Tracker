import React from 'react';
import {Link} from 'react-router-dom';

import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';

export default class IssueEdit extends React.Component{
    constructor(){
        super();
        this.state = {
            issue: {},
            invalidFields: {}
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onValidityChange = this.onValidityChange.bind(this);
    }

    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prevProps){
        const {match:{params:{id:prevId}}} = prevProps;
        const {match:{params:{id}}} = this.props;
        if(id!==prevId){
            this.loadData();
        }
    }

    onChange(e,naturalValue){
        const {name,value:textValue} = e.target;
        const value = naturalValue === undefined ? textValue : naturalValue;
        this.setState(prevState=>{
            return {
                issue:{
                    ...prevState.issue,
                    [name]:value
                    }
                };
        });
    }

    handleSubmit(e){
        e.preventDefault();
        const {issue} =this.state;
        console.log(issue);
    }

    onValidityChange(e,valid){
        const {name} = e.target;
        this.setState(prevState=>{
            const invalidFields =  {...prevState.invalidFiels,[name]:!valid};
            if(valid) delete invalidFields[name];
            return {invalidFields};
        });
    }

    async loadData(){
        const query = `query issue($id: Int!){
            issue(id: $id){
                id title status owner
                effort created due description
            }
        }`;
        const {match: {params: {id}}} = this.props;
        const data = await graphQLFetch(query,{id});
        if(data){
            const {issue} = data;
            issue.description = issue.description!=null ? issue.description.toString() : '';
            issue.owner = issue.owner!=null ? issue.owner.toString() : '';
            this.setState({issue,invalidFields:{}});
        }else{
            this.setState({issue:{},invalidFields:{}});
        }
    }

    render(){
        const {issue:{id}} = this.state;
        const {match:{params:{id:propsId}}} = this.props;
        const {invalidFields} =this.state;
        let validationMessage;
        if(Object.keys(invalidFields).length!==0){
            validationMessage =( <div className="error">
                Pleas Correct Invalid Fields before Submitting
            </div>);
        }
        if(id == null){
            if(propsId!=null){
                return(
                    <h3> Requested Id:{propsId} not Found</h3>
                )
                return null;
            }
        }

        const {issue:{title,status}} = this.state;
        const {issue:{description,effort,owner}} = this.state;
        const {issue:{due,created}} = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Editing Issue : {id}</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Created :</td>
                            <td>{created.toDateString()}</td>
                        </tr>
                        <tr>
                            <td>Status :</td>
                            <td>
                                <select name="status" value={status} onChange={this.onChange}>
                                    <option value="All">(All)</option>
                                    <option value="New">New</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Fixed">Fixed</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Owner :</td>
                            <td>
                                <input
                                 name="owner"
                                 value={owner}
                                 onChange={this.onChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Effort :</td>
                            <td>
                                <NumInput
                                 name="effort"
                                 value={effort}
                                 onChange={this.onChange}
                                 key={id}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Due :</td>
                            <td>
                                <DateInput
                                 name="due"
                                 value={due}
                                 onChange={this.onChange}
                                 onValidityChange={this.onValidityChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Title :</td>
                            <td>
                                <input 
                                 size={50}
                                 name="title"
                                 value={title}
                                 onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Description :</td>
                            <td>
                                <textarea
                                 rows={8}
                                 cols={50}
                                 name="description"
                                 value={description}
                                 onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td/>
                            <td>
                                <button type="submit" >Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {validationMessage}
                <Link to={`/edit/${id-1}`}>Prev</Link>
                {' | '}
                <Link to={`/edit/${id+1}`}>Next</Link>
            </form>
        )
    }
}