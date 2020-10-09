import React from 'react';

import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: []
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    console.log('i ran in app')
    axios.get('/data')
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err))

  }
  render() {
    return (
      <div>Hello World from newest app with get request</div>
    );
  }
}

export default App;