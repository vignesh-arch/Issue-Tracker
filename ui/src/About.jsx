import React from 'react';

import store from './store.js';
import graphQLFetch from './graphQLFetch.js';

export default class About extends React.Component {
  static async fetchData() {
    const data = await graphQLFetch('query{about}');
    return data;
  }

  constructor() {
    super();
    const apiAbout = store.initialData ? store.initialData.about : null;
    delete store.initialData;
    this.state = {
      apiAbout,
    };
  }

  async componentWillMount() {
    const { apiAbout } = this.state;
    if (apiAbout == null) {
      const data = await About.fetchData(null, null, null);
      this.setState({ apiAbout: data.about });
    }
  }

  render() {
    const { apiAbout } = this.state;
    return (
      <div className="text-center">
        <h3>Issue Tracker 0.9</h3>
        <h4>{apiAbout}</h4>
      </div>
    );
  }
}
