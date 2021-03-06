import React, { Component } from "react";
import { Card, Button, Accordion, Table, Modal, Form } from "react-bootstrap";
import { TrashFill, PencilFill, PatchPlusFill } from "react-bootstrap-icons";

export default class CronInfoTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskDetail: this.props.taskDetail,
      tmpCron: { id: null, cronValue: null },
      isOpenDeleteModal: false,
      isOpenEditModal: false,
      formErrors: [],
    };
    this.setDeleteShow = this.setDeleteShow.bind(this);
    this.setEditShow = this.setEditShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
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

  setDeleteShow = (val, cron) => {
    this.setState({
      isOpenDeleteModal: val,
      tmpCron: cron,
    });
  };
  setEditShow = (val, cron) => {
    this.setState({
      isOpenEditModal: val,
      tmpCron: cron,
    });
  };

  handleClose = () => {
    this.setState({
      isOpenDeleteModal: false,
    });
  };

  handleDelete = () => {
    var index = this.state.taskDetail.crons.findIndex(
      (e) => e.id == this.state.tmpCron.id
    );
    var _crons = [...this.state.taskDetail.crons];
    _crons.splice(index, 1);
    this.setState({
      taskDetail: { ...this.state.taskDetail, crons: _crons },
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
      this.state.tmpCron == null ||
      this.state.tmpCron.cronValue == null ||
      this.state.tmpCron.cronValue === "" ||
      this.state.tmpCron.cronValue === " "
    ) {
      formErrors.push("cronValue");
    }


    this.setState({
      formErrors: formErrors,
    });

    if (formErrors.length > 0) {
      return false;
    } else {
      var _crons = [...this.state.taskDetail.crons];
      if (this.state.tmpCron.id != null) {
        var index = this.state.taskDetail.crons.findIndex(
          (e) => e.id == this.state.tmpCron.id
        );
        _crons[index] = this.state.tmpCron;
      } else {
        _crons.push(this.state.tmpCron);
      }
      this.setState({
        taskDetail: { ...this.state.taskDetail, crons: _crons },
        isOpenEditModal: false,
      });
    }
  };

  newRecordShow = (val) => {
    this.setState({
      isOpenEditModal: val,
      tmpCron: {id: null, cronValue: null},
    });
  }

  render() {
    return (
      <div>
        <Accordion defaultActiveKey="0">
          <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1" style={{ color : '#0275d8', fontSize: 18}}>
                Cron Value Information
              </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Table responsive borderless>
                  <thead>
                    <tr key={this.state.taskDetail.id}>
                      <th>id</th>
                      <th>Cron Value</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.taskDetail.crons.map((e) => {
                      return (
                        <tr key={e.id}>
                          <td>{e.id}</td>
                          <td>{e.cronValue}</td>
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
                <Button onClick={() => this.newRecordShow(true)} variant="success">New Cron</Button>
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
            <Modal.Title>Edit Cron Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="id">
                <Form.Label>Id</Form.Label>
                <Form.Control disabled value={this.state.tmpCron.id} />
              </Form.Group>

              <Form.Group controlId="cronValue">
                <Form.Label>Cron Value</Form.Label>
                <Form.Control
                  placeholder="Enter Cron Value"
                  isInvalid={this.hasError("cronValue")}
                  onChange={(e) =>
                    this.setState({
                      tmpCron: {
                        ...this.state.tmpCron,
                        cronValue: e.target.value,
                      },
                    })
                  }
                  value={this.state.tmpCron.cronValue}
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
