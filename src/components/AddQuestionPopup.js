import React, { Component } from 'react';
import {
  Col,
  Modal,
  FormGroup,
  FormControl,
  Button
  // Radio
} from 'react-bootstrap';
import Select from 'react-select';
// Import helper
import { isObjectEmpty } from './Helper';
import { getRoles, getMappings, createQuestion, editQuestion } from '../services/question';
export default class AddQuestionPopup extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const initialState = {
      questionForm: {
        question: '',
        team_stage: '',
        appear: '',
        frequency: '',
        question_type: '',
        conditions: '',
        is_required: 'yes',
        role_id: '',
        role_option: '',
        mapping_id: '',
        mapping_option: ''
      },
      roles: [],
      mappings: [],
      errors: {}
    };

    return initialState;
  }

  componentWillMount() {
    this.getRoles()
    this.getMappings()
    if (!isObjectEmpty(this.props.editObject)) {
      this.editQuestion(this.props.editObject);
    }
  }

  editQuestion(questions) {
    var self = this;
    const { question, team_stage, appear, frequency, question_type, conditions  } = questions;
    self.setState({
      questionForm: {
        question: question,
        team_stage: team_stage,
        appear: appear,
        frequency: frequency,
        question_type: question_type,
        conditions: conditions,
        role_option: self.roleOptions([questions.role]),
        mapping_option: self.mappingOptions([questions.mapping])
      }
    });
  }

  getRoles(){
    var self = this;
    getRoles()
      .then(function(response) {
        var data = response.data;
        self.setState({ roles: data });
      })
      .catch(function(error) {
        console.log(error.response);
      });
  }

  getMappings(){
    var self = this;
    getMappings()
      .then(function(response) {
        var data = response.data;
        self.setState({ mappings: data });
      })
      .catch(function(error) {
        console.log(error.response);
      });
  }

  roleOptions(roles = this.state.roles) {
    var options = [];
    roles.map(role => {
      return options.push({
        value: role.id,
        label: role.name
      });
    });
    return options;
  }

  mappingOptions(mappings = this.state.mappings) {
    var options = [];
    mappings.map(mapping => {
      return options.push({
        value: mapping.id,
        label: mapping.mapping_name
      });
    });
    return options;
  }

  handleChange(e) {
    const questionForm = this.state.questionForm;
    var key = e.target.name;
    questionForm[key] = e.target.value;
    this.setState({
      questionForm
    });
  }

  handleRoleSelectChange(value) {
    const questionForm = this.state.questionForm;
    questionForm['role_option'] = value;
    questionForm['role_id'] = value.value;
    this.setState({
      questionForm
    });
  }

  handleMappingSelectChange(value) {
    const questionForm = this.state.questionForm;
    questionForm['mapping_option'] = value;
    questionForm['mapping_id'] = value.value;
    this.setState({
      questionForm
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var self = this;
    var callQuestionApi = () => {};
    if (isObjectEmpty(self.props.editObject)) {
      var createParams = this.state.questionForm;
      callQuestionApi = createQuestion({question: createParams});
    } else {
      callQuestionApi = editQuestion({question: self.state.questionForm, id: self.props.editObject.id});
    }
    callQuestionApi
      .then(function(response) {
        if(response.status === 200){
          self.resetQuestionForm();
          self.props.renderQuestion(
            response.data,
            isObjectEmpty(self.props.editObject) ? 'insert' : 'replace'
            );
          self.props.hideCreatePopup();
        }
      })
      .catch(function(error) {
        console.log(error.response);
      });
  }
  render() {
    const { questionForm, errors } = this.state;
    return (
      <Modal
        show={this.props.showCreate}
        className="add-category-modal"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton onClick={this.props.closeOn}>
          <Modal.Title>
            <h4>
              {isObjectEmpty(this.props.editObject) ? (
                'Create New Category'
              ) : (
                'Edit Category'
              )}
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-category-body p-none">
          <Col className="add-content-wrap" sm={12}>
            <form className="admin-side create-album-form custom-form">
              <FormGroup className="custom-form-group required">
                <label className="custom-form-control-label">
                  Question name
                </label>
                <FormControl
                  className="custom-form-control"
                  type="text"
                  name="question"
                  placeholder="Name"
                  value={questionForm.question}
                  onChange={this.handleChange.bind(this)}
                />
                {errors['question'] && (
                  <span className="input-error text-red">
                    {errors['question']}
                  </span>
                )}
              </FormGroup>
              <FormGroup className="custom-form-group required">
                <label className="custom-form-control-label">
                  Teaming Stages
                </label>
                <FormControl
                  className="custom-form-control"
                  type="text"
                  name="team_stage"
                  placeholder="Team Stage"
                  value={questionForm.team_stage}
                  onChange={this.handleChange.bind(this)}
                />
                {errors['team_stage'] && (
                  <span className="input-error text-red">
                    {errors['team_stage']}
                  </span>
                )}
              </FormGroup>
              <FormGroup className="custom-form-group required">
                <label className="custom-form-control-label">
                  Appears
                </label>
                <FormControl
                  className="custom-form-control"
                  type="text"
                  name="appear"
                  placeholder="Appear"
                  value={questionForm.appear}
                  onChange={this.handleChange.bind(this)}
                />
                {errors['appear'] && (
                  <span className="input-error text-red">
                    {errors['appear']}
                  </span>
                )}
              </FormGroup>
              <FormGroup className="custom-form-group required">
                <label className="custom-form-control-label">
                  Frequency
                </label>
                <FormControl
                  className="custom-form-control"
                  type="text"
                  name="frequency"
                  placeholder="Frequency"
                  value={questionForm.frequency}
                  onChange={this.handleChange.bind(this)}
                />
                {errors['frequency'] && (
                  <span className="input-error text-red">
                    {errors['frequency']}
                  </span>
                )}
              </FormGroup>
              <FormGroup className="custom-form-group required">
                <label className="custom-form-control-label">
                  Question Type
                </label>
                <FormControl
                  className="custom-form-control"
                  type="text"
                  name="question_type"
                  placeholder="Question Type"
                  value={questionForm.question_type}
                  onChange={this.handleChange.bind(this)}
                />
                {errors['question_type'] && (
                  <span className="input-error text-red">
                    {errors['question_type']}
                  </span>
                )}
              </FormGroup>
              <FormGroup className="custom-form-group required">
                <label className="custom-form-control-label">
                  Conditions
                </label>
                <FormControl
                  className="custom-form-control"
                  type="text"
                  name="conditions"
                  placeholder="Conditions"
                  value={questionForm.conditions}
                  onChange={this.handleChange.bind(this)}
                />
                {errors['conditions'] && (
                  <span className="input-error text-red">
                    {errors['conditions']}
                  </span>
                )}
              </FormGroup>
              <FormGroup controlId="formControlsSelect">
                <label className="custom-form-control-label">
                  Role
                </label>
                <Select
                  className="custom-form-control"
                  name="role_option"
                  value={questionForm.role_option}
                  options={this.roleOptions()}
                  onChange={this.handleRoleSelectChange.bind(this)}
                />
                {errors['role_id'] && (
                  <span className="input-error text-red">
                    {errors['role_id']}
                  </span>
                )}
              </FormGroup>
              <FormGroup controlId="formControlsSelect">
                <label className="custom-form-control-label">
                  Mapping
                </label>
                <Select
                  className="custom-form-control"
                  name="mapping_option"
                  value={questionForm.mapping_option}
                  options={this.mappingOptions()}
                  onChange={this.handleMappingSelectChange.bind(this)}
                />
                {errors['mapping_id'] && (
                  <span className="input-error text-red">
                    {errors['mapping_id']}
                  </span>
                )}
              </FormGroup>
              <Button
                type="submit"
                className="btn btn-orange create-video-submit"
                onClick={event => this.handleSubmit(event)}
              >
                Save
              </Button>
            </form>
          </Col>
        </Modal.Body>
      </Modal>
    )
  }
}