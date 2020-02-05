import React, { Component } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/posts";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { file: null, imgURL: [] };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = e => {
    this.setState({ file: e.target.files[0] });
  };

  onSubmit = e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", this.state.file);

    axios.post(`${API_URL}/upload`, data).then(res => {
      return res;
    });
  };

  async componentDidMount() {
    const response = await fetch(`${API_URL}/files`);
    const fileArray = await response.json();

    fileArray.forEach(i => {
      fetch(`${API_URL}/images/${i.filename}`).then(img => {
        this.setState({
          imgURL: [...this.state.imgURL, img.url]
        });
      });
    });
  }

  render() {
    return (
      <>
        <div className="container">
          <h1>File Upload</h1>
          <form encType="multipart/form-data">
            <input type="file" name="file" id="file" onChange={this.onChange} />
            <button type="submit" onClick={this.onSubmit}>
              Upload
            </button>
          </form>
        </div>
        <div className="grid-3">
          {this.state.imgURL.map((img, key) => {
            return (
              <video key={key} controls>
                <source src={img} type="video/mp4" />
              </video>
            );
          })}
        </div>
      </>
    );
  }
}
