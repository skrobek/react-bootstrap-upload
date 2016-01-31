import React from 'react';
import ReactDOM from 'react-dom';
import MultiUpload from './react-multi-upload/MultiUpload';
import Calendar from './react-calendar';


class Example extends React.Component {
  onUpload = (files) => {
    console.log(files);
  };

  render() {
    return (
      <div className="content">
        {/*<div className="page-multi-upload-example">
          <MultiUpload onUpload={this.onUpload} />
        </div>*/}
        <div className="page-calendar-example">
          <Calendar />
        </div>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  require('./styles.scss');
}

const runApp = () => {
  ReactDOM.render(
    <Example />,
    document.getElementById('app')
  );
};

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', runApp);
} else {
  window.attachEvent('onload', runApp);
}
