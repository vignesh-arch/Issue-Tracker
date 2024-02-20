import React from "react";
import {
    Navbar,
    NavItem,
    Nav,
    Glyphicon,
    NavDropdown,
    MenuItem,
    Grid,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import Contents from "./Contents.jsx";
import IssueAddNavItem from "./IssueAddNavItem.jsx";

function NavBar() {
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
            <Nav pullRight>
                <IssueAddNavItem />
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
                Want to See the Source Code?{" "}
                <a href="https://github.com/vignesh-arch/Issue-Tracker">
                    Github Source Code
                </a>
            </p>
        </small>
    );
}

export default function Page() {
    return (
        <div>
            <NavBar />
            <Grid fluid>
                <Contents />
            </Grid>
            <Footer />
        </div>
    );
}
