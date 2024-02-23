import React from 'react';
import { MenuItem, Modal, NavDropdown, Button, NavItem } from 'react-bootstrap';

import withToast from './withToast.jsx'

class SignInNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      disabled: true,
      user: { signedIn: false, givenName: '' },
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  async componentDidMount() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) return;
    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: clientId,plugin_name: "vignesh" }).then(() => {
          this.setState({ disabled: false });
        });
      }
    });
    await this.loadData();
  }

  async signIn() {
    this.hideModal();
    const { showError } = this.props;
    let googleToken;
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (err) {
      showError(`Error Authenticating with Google :${err.error}`);
    }
    try {
      const apiEndPoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndPoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_token: googleToken }),
      });
      const result = await response.json();
      const { givenName, signedIn } = result;
      this.setState({ user: { givenName, signedIn } });
    }catch (error) {
      showError(`Error Signing into the app ${error}`);
    }
  }

  signOut() {
    this.setState({ user: { signedIn: false, givenName: '' } });
  }

  async loadData() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST',
    });
    const body = await response.text();
    const result = JSON.parse(body);
    const { signedIn, givenName } = result;
    this.setState({ user: { signedIn, givenName } });
  }
    
  showModal() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    const { showError } = this.props;
    if (!clientId) {
        showError(`Client id not found in Environmental variable`);
        return;
    }
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  render() {
    const { showing,disabled, user } = this.state;
    if (user.signedIn) {
      return (
        <NavDropdown title={user.givenName} id='user'>
          <MenuItem onClick={this.signOut}>Sign Out</MenuItem>
        </NavDropdown>
      );
    }
    return (
      <React.Fragment>
        <NavItem onClick={this.showModal}>Sign In</NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal} bsSize='sm'>
          <Modal.Header closeButton>
            <Modal.Title>Sign In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button
              block
              bsStyle='primary'
              disabled={disabled}
              onClick={this.signIn}
            >
              <img
                src='https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png'
                alt='Sign In'
              />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='link' onClick={this.hideModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withToast(SignInNavItem);