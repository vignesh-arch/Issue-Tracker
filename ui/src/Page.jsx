import React from 'react';
import {
  Navbar,
  NavItem,
  Nav,
  Glyphicon,
  NavDropdown,
  MenuItem,
  Grid,
  Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import SearchBar from './SearchBar.jsx';
import SignInNavItem from './SignInNavItem.jsx';

function NavBar({user,onUserChange}) {
  return (
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand>Issue Tracker</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer exact to="/">
          <NavItem>Home</NavItem>
        </LinkContainer>
        <LinkContainer to="/issues">
          <NavItem>Issue List</NavItem>
        </LinkContainer>
        <LinkContainer to="/report">
          <NavItem>Report</NavItem>
        </LinkContainer>
      </Nav>
      <Col sm={5}>
        <Navbar.Form>
          <SearchBar />
        </Navbar.Form>
      </Col>
      <Nav pullRight>
        <IssueAddNavItem user={user} />
        <SignInNavItem user={user} onUserChange={onUserChange} />
        <NavDropdown
          id="user-dropdown"
          title={<Glyphicon glyph="option-vertical" />}
          noCaret
        >
          <LinkContainer to="/about">
            <MenuItem>About</MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

function Footer() {
  return (
    <small>
      <hr />
      <p className="text-center">
        Want to See the Source Code?{' '}
        <a href="https://github.com/vignesh-arch/Issue-Tracker">
          Github Source Code
        </a>
      </p>
    </small>
  );
}

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { signedIn: false },
    };
    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST',
    });
    const data = await response.text();
    const result = JSON.parse(data);
    const { signedIn, givenName } = result;
    this.setState({ user: { signedIn, givenName } });
  }

  onUserChange(user) {
    this.setState({ user });  
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        <NavBar user={user} onUserChange={this.onUserChange} />
        <Grid fluid>
          <Contents />
        </Grid>
        <Footer />
      </div>
    );
  }
}
