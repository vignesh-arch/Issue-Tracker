import React from 'react';

import Toast from './Toast.jsx';

export default function withToast(OriginalComponent) {
  return class ToastWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        toastVisible: false,
        toastMessage: '',
        toastType: 'success',
      };
      this.showSuccess = this.showSuccess.bind(this);
      this.showError = this.showError.bind(this);
      this.dismissToast = this.dismissToast.bind(this);
    }

    showSuccess(msg) {
      this.setState({
        toastVisible: true,
        toastMessage: msg,
        toastType: 'success',
      });
    }
    showError(msg) {
      this.setState({
        toastVisible: true,
        toastMessage: msg,
        toastType: 'danger',
      });
    }
    dismissToast() {
      this.setState({ toastVisible: false });
    }

    render() {
      const { toastVisible, toastMessage, toastType } = this.state;
      return (
        <React.Fragment>
          <OriginalComponent
            showError={this.showError}
            showSuccess={this.showSuccess}
            dismissToast={this.dismissToast}
            {...this.props}
          />
          <Toast
            showing={toastVisible}
            bsStyle={toastType}
            onDismiss={this.dismissToast}
          >
            {toastMessage}
          </Toast>
        </React.Fragment>
      );
    }
  };
}
