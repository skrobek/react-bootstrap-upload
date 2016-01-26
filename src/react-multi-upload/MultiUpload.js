import React, { PropTypes } from 'react';


class MultiUpload extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      files: []
    };
  }

  onDragLeave = () => {
    this.setState({
      isDragActive: false
    });
  };


  onClick = () => {
    this.refs.fileInput.click();
  };


  onAdd = (e) => {
    e.preventDefault();

    this.setState({
      isDragActive: false,
      isLoading: true
    });

    const files = this.getFiles(e);
    const filesList = this.state.files || [];

    for (let i = 0; i < files.length; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
      filesList.push(files[i]);
    }

    this.setState({
      files: filesList,
      isLoading: false
    });
  };


  getFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const decimals = 3;
    const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = (bytes / Math.pow(k, i)).toPrecision(decimals);
    return `${size} ${sizes[i]};`
  }


  getFiles(e) {
    let files;

    if (e.dataTransfer && e.dataTransfer.files) {
      files = e.dataTransfer.files;
    } else {
      if (e.target && e.target.files) {
        files = e.target.files;
      }
    }

    return files;
  }


  removeFromUpload = (index) => {
    const list = this.state.files;
    list.splice(index, 1);
    this.setState({ files: list });
  };


  uploadFiles = () => {
    this.props.onUpload(this.state.files);
  };


  renderUploadButton() {
    if (this.state.files.length === 0) {
      return null;
    }

    return (
      <button className="multi-upload-btn" onClick={this.uploadFiles}>
        Upload Files
      </button>
    );
  }

  renderMultiUpload = (file, i) => {
    const styles = {
      height: '100px',
      width: '120px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundImage: `url('${file.preview}')`
    };

    return (
      <li className="media" key={i} style={{marginBottom: '10px'}}>
        <div className="media-left">
          <div className="upload-file-preview" style={styles} />
        </div>
        <div className="media-body">
          <div>{file.name}</div>
          <div>{this.getFileSize(file.size)}</div>
          <button className="btn btn-danger btn-sm" onClick={this.removeFromUpload.bind(this, i)}>
            Remove
          </button>
        </div>
      </li>
    );
  };


  renderUploadButtn() {
    return (
      <button className="btn btn-primary" onClick={this.onClick}>
        <span className="glyphicon glyphicon-plus"/>&nbsp;{this.props.text.label}
      </button>
    );
  }


  render() {
    const dropZoneStyles = {
      border: '1px solid #000'
    };
    const inputStyles = { display: 'none' };


    return (
      <div className="panel panel-default">
        <div className="panel-body">
          {this.renderUploadButtn()}
          <input
            style={inputStyles}
            type="file"
            multiple="true"
            ref="fileInput"
            onChange={this.onAdd}
          />
          <div className="clearfix" />
          <ul className="media-list">
            {this.state.files.map(this.renderMultiUpload)}
          </ul>
          {this.renderUploadButton()}
        </div>
      </div>
    );
  }
}


MultiUpload.propTypes = {
  onUpload: React.PropTypes.func.isRequired,
  text: PropTypes.shape({
    label: PropTypes.string
  })
};


MultiUpload.defaultProps = {
  text: {
    label: 'Add new files'
  }
};

export default MultiUpload;
