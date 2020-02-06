import React, { Component } from "react";

// Styles
import { Upload, message, Button, Icon, Row, Col, Layout, Divider } from "antd";

const { Header, Footer, Content } = Layout;

const API_URL = "https://obscure-refuge-53058.herokuapp.com/api/v1/posts";

const props = {
  name: "file",
  action: `${API_URL}/upload`,
  headers: {
    authorization: "authorization-text"
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.filelist);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { file: null, imgURL: [] };
  }

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
      <Layout>
        <Header style={{ backgroundColor: "#222" }}>
          <h1 style={{ color: "#eee" }}>File Upload</h1>
        </Header>
        <Content>
          <Upload {...props}>
            <Button style={{ margin: "1rem" }}>
              <Icon type="upload" />
              Click To Upload
            </Button>
          </Upload>
          <Row style={{ padding: "2rem" }}>
            {this.state.imgURL.map((img, key) => {
              return (
                <Col span={8} key={key}>
                  <video width="60%" controls>
                    <source src={img} type="video/mp4" />
                  </video>
                </Col>
              );
            })}
          </Row>
        </Content>
        <Footer>
          <Divider />
          <div>File Uploader &copy; 2020 Josh Hyde</div>
        </Footer>
      </Layout>
    );
  }
}
