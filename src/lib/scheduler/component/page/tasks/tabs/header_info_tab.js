import React, { Component } from "react";
import { Card, Button, Accordion, Table, Modal, Form } from "react-bootstrap";
import { TrashFill, PencilFill, PlusCircle } from "react-bootstrap-icons";

export default class HeaderInfoTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskDetail: this.props.taskDetail,
      tmpHeader: { id: null, key: "", value: "" },
      isOpenDeleteModal: false,
      isOpenEditModal: false,
      formErrors: [],
    };
    this.setDeleteShow = this.setDeleteShow.bind(this);
    this.setEditShow = this.setEditShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.newRecordShow = this.newRecordShow.bind(this);
    
  }

  componentDidUpdate(prevProps) {
    if (prevProps.taskDetail.id !== this.props.taskDetail.id) {
      this.setState({
        taskDetail: this.props.taskDetail,
      });
    }
  }

  hasError(key) {
    return this.state.formErrors.indexOf(key) !== -1;
  }

  setDeleteShow = (val, header) => {
    this.setState({
      isOpenDeleteModal: val,
      tmpHeader: header,
    });
  };
  setEditShow = (val, header) => {
    this.setState({
      isOpenEditModal: val,
      tmpHeader: header,
    });
  };

  
  handleDelete = () => {
    var index = this.state.taskDetail.requestHeaders.findIndex(e => e.id == this.state.tmpHeader.id);
    var _headers = [...this.state.taskDetail.requestHeaders];
    _headers.splice(index, 1);
    this.setState({
      taskDetail: { ...this.state.taskDetail, requestHeaders: _headers},
      isOpenDeleteModal: false
    });
  };

  handleClose = () => {
    this.setState({
      isOpenDeleteModal: false,
    });
  };

  handleEditClose = () => {
    this.setState({
      isOpenEditModal: false,
    });
  };

  handleSave = () => {

    let formErrors = [];

    if (
      this.state.tmpHeader == null ||
      this.state.tmpHeader.key == null ||
      this.state.tmpHeader.key === "" ||
      this.state.tmpHeader.key === " "
    ) {
      formErrors.push("headerKey");
    }

    if (
      this.state.tmpHeader == null ||
      this.state.tmpHeader.value == null ||
      this.state.tmpHeader.value === "" ||
      this.state.tmpHeader.value === " "
    ) {
      formErrors.push("headerValue");
    }


    this.setState({
      formErrors: formErrors,
    });

    if (formErrors.length > 0) {
      return false;
    } else {

      var _headers = [...this.state.taskDetail.requestHeaders];

      if(this.state.tmpHeader.id != null) {
        var index = this.state.taskDetail.requestHeaders.findIndex(e => e.id == this.state.tmpHeader.id);  
        _headers[index] = this.state.tmpHeader;
      } else {
        _headers.push(this.state.tmpHeader);
      }
      
      this.setState({
        taskDetail: { ...this.state.taskDetail, requestHeaders: _headers},
        isOpenEditModal: false
      });
    }
  };

  newRecordShow = (val) => {
    this.setState({
      isOpenEditModal: val,
      tmpHeader: { id: null, key: "", value: "" },
    });
  }

  render() {
    return (
      <div>
        <Accordion defaultActiveKey="0">
          <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1" style={{ color : '#0275d8', fontSize: 18}}>
                Header Information
              </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Table responsive borderless>
                <thead>
                  <tr key={this.state.taskDetail.id}>
                    <th>id</th>
                    <th>Header Name</th>
                    <th>Header Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.taskDetail.requestHeaders.map((e) => {
                    return (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{e.key}</td>
                        <td>{e.value}</td>
                        <td>
                          <Button
                            onClick={() => this.setEditShow(true, e)}
                            variant="outline-info"
                          >
                            <PencilFill />
                          </Button>{" "}
                          <Button
                            onClick={() => this.setDeleteShow(true, e)}
                            variant="outline-danger"
                          >
                            <TrashFill />
                          </Button>{" "}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Button onClick={() => this.newRecordShow(true)} variant="success">New Header</Button>
                </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <Modal show={this.state.isOpenDeleteModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure want to delete?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.isOpenEditModal} onHide={this.handleEditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Header Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="id">
                <Form.Label>Id</Form.Label>
                <Form.Control disabled value={this.state.tmpHeader.id} />
              </Form.Group>

              <Form.Group controlId="headerKey">
                <Form.Label>Header Key</Form.Label>
                <Form.Control
                  placeholder="Enter Header Key"
                  isInvalid={this.hasError("headerKey")}
                  onChange={(e) =>
                    this.setState({
                      tmpHeader: {
                        ...this.state.tmpHeader,
                        key: e.target.value,
                      },
                    })
                  }
                  value={this.state.tmpHeader.key}
                />
              </Form.Group>

              <Form.Group controlId="headerValue">
                <Form.Label>Header Value</Form.Label>
                <Form.Control
                  label="Header Value"
                  isInvalid={this.hasError("headerValue")}
                  onChange={(e) =>
                    this.setState({
                      tmpHeader: {
                        ...this.state.tmpHeader,
                        value: e.target.value,
                      },
                    })
                  }
                  value={this.state.tmpHeader.value}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={this.handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
