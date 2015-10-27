import React from "react";
import ReactDOM from "react-dom";
import MultiUpload from "./react-multi-upload/MultiUpload.jsx";


class Example extends React.Component {
  onUpload = (files) => {
    console.log(files);
  }

  render () {
    return(
      <div className="page-multi-upload-example">
        <MultiUpload onUpload={this.onUpload} />
      </div>
    );
  }
}


const runApp = () => {
  ReactDOM.render(
    <Example />,
    document.getElementById("app")
  );
}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', runApp);
} else {
  window.attachEvent('onload', runApp);
}
