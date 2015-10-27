import React, { PropTypes } from 'react';


class MultiUpload extends React.Component {
  constructor() {
    super();

    this.state = {
      isDragActive: false,
      isLoading: false,
      files: []
    };
  }


  onDragLeave = (e) => {
    this.setState({
      isDragActive: false
    })
  }


  onDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    this.setState({ isDragActive: true })
  }


  getFiles(e) {
    let files;

    if (e.dataTransfer && e.dataTransfer.files) {
      files = e.dataTransfer.files
    }
    else if (e.target && e.target.files) {
      files = e.target.files
    }

    return files;
  }


  onDrop = (e) => {
    e.preventDefault()

    this.setState({
      isDragActive: false,
      isLoading: true
    })

    let files = this.getFiles(e);
    let filesList = this.state.files || [];

    for (let i = 0; i < files.length; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
      filesList.push(files[i]);
    }

    this.setState({
      files: filesList,
      isLoading: false
    });
  }


  removeFromUpload = (index) => {
    let list = this.state.files;
    list.splice(index, 1);
    this.setState({ files: list });
  }


  renderMultiUpload = (file, i) => {
    let styles = {
      backgroundImage: `url('${file.preview}')`
    };

    return(
      <li className="upload-file" key={i}>
        <div className="upload-file-preview" style={styles} />
        {file.name}
        <div className="upload-file-cancel" onClick={this.removeFromUpload.bind(this, i)}>x</div>
      </li>
    );
  }


  renderUploadButton() {
    if (this.state.files.length == 0) {
      return "";
    }

    return(
      <button className="multi-upload-btn" onClick={this.uploadFiles}>
        Upload Files
      </button>
    );
  }


  uploadFiles = () => {
    this.props.onUpload(this.state.files);
  }


  onClick = () => {
    this.refs.fileInput.click()
  }


  render() {
    let className = 'dropzone';
    let styles = { display: "none" };
    let status = (this.state.isLoading) ? this.props.text.onDrop : this.props.text.label;

    if (this.state.isDragActive) {
      className += ' active';
    }

    return(
      <div className="multi-upload-wrapper">
        <div className="multi-upload-dropzone">
          <div className={className} onClick={this.onClick} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop}>
            {status}
            <input style={styles} type="file" multiple="true" ref="fileInput" onChange={this.onDrop} />
          </div>
        </div>
        <ul className="multi-upload-list">
          {this.state.files.map(this.renderMultiUpload)}
        </ul>
        {this.renderUploadButton()}
      </div>
    );
  }
}


MultiUpload.propTypes = {
  onUpload: React.PropTypes.func.isRequired
};


MultiUpload.defaultProps = {
  text: {
    label: "Click or drag file here",
    onDrop: "Loading files..."
  }
}

export default MultiUpload;
