import React, { Component } from 'react';
import { Col, Table, Button } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
// Import component
import QuestionPopup from './AddQuestionPopup';
import { isObjectEmpty } from './Helper';
import { getQuestions, deleteQuestion } from '../services/question';


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CreateShow: false,
      editObject: {},
      questions: [],
      alert: {
        objectId: '',
        show: false,
        cancelBtn: true,
        confirmAction: () => {},
        title: '',
        text: '',
        btnText: '',
        type: ''
      }
    }
  }

  componentWillMount() {
    this.getQuestions()
  }

  getQuestions(){
    var self = this;
    getQuestions()
    .then(function(response) {
      var data = response.data
        if (response.status === 200) {
          self.setState({ questions: data });
        }
      })
      .catch(function(error) {
        console.log(error.response);
      });
  }

  showDialogueBox(id) {
    this.setState({
      alert: {
        objectId: id,
        show: true,
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        btnText: 'Yes, delete it!',
        type: 'warning',
        confirmAction: () => this.deleteQuestion(),
        cancelBtn: true
      }
    });
  }

  hideDialogueBox() {
    this.setState({ alert: { show: false } });
  }

  deleteQuestion() {
    var self = this;

    deleteQuestion(self.state.alert.objectId)
      .then(function(response) {
        if (response.status === 200) {
          const questions = self.state.questions.filter(
            question => question.id !== self.state.alert.objectId
          );
          self.setState({
            questions: questions,
            alert: {
              show: true,
              title: 'Success',
              text: response.data.message,
              type: 'success',
              confirmAction: () => self.hideDialogueBox()
            }
          });
        } else {
        }
      })
      .catch(function(error) {
      });
  }
  
  renderQuestion = (question, action) => {
    var self = this
    const newQuestions = self.state.questions.slice();
    if (action === 'insert') {
      newQuestions.splice(0, 0, question);
    } else if (action === 'replace' && !isObjectEmpty(self.state.editObject)) {
      newQuestions.splice(
        newQuestions.indexOf(self.state.editObject),
        1,
        question
      );
    }

    self.setState({
      questions: newQuestions,
    });
  };
  hideCreatePopup = () => {
    this.setState({ CreateShow: false, editObject: {} });
  };
  CreateClose = () => this.setState({ CreateShow: false, editObject: {} });
  render() {
    return (
      <div className="container">
        <SweetAlert
          show={this.state.alert.show || false}
          title={this.state.alert.title || ''}
          text={this.state.alert.text || ''}
          type={this.state.alert.type || 'success'}
          showCancelButton={this.state.alert.cancelBtn}
          confirmButtonText={this.state.alert.btnText}
          onConfirm={this.state.alert.confirmAction}
          onCancel={() => this.hideDialogueBox()}
        />
        {this.state.CreateShow && (
          <QuestionPopup
            showCreate={this.state.CreateShow}
            // closeOn={this.CreateClose}
            editObject={this.state.editObject}
            renderQuestion={this.renderQuestion}
            hideCreatePopup={this.hideCreatePopup}
          />
        )}
        <h1>Question</h1>
        <Col xs={12} className="filter-wrap p-none">
          <Col xs={12} className="p-none">
            <Button className="btn pull-right add-new-btn" onClick={()=>this.setState({ CreateShow: true })}>
              Add New
            </Button>
          </Col>
        </Col>
        <Col xs={12} className="p-none">
          <div className="questions-table-wrap">
            <Table responsive className="questions-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Teaming Stages</th>
                  <th>Appears</th>
                  <th>Frequency</th>
                  <th>Type</th>
                  <th>Role</th>
                  <th>Required</th>
                  <th>Condition</th>
                  <th>Mapping</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {this.state.questions.map(question => (
                <tr key={question.id}>
                  <td>{question.question}</td>
                  <td>{question.team_stage}</td>
                  <td>{question.appear}</td>
                  <td>{question.frequency}</td>
                  <td>{question.question_type}</td>
                  <td>{question.role.name}</td>
                  <td>{question.is_required}</td>
                  <td>{question.conditions}</td>
                  <td>{question.mapping.mapping_name}</td>
                  <td>
                    <a
                      className="edit-icon"
                      onClick={() =>
                        this.setState({
                          CreateShow: true,
                          editObject: question
                        })}
                    >
                      <img
                        src={require('../assets/images/edit-icon.png')}
                        alt=""
                      />
                    </a>
                    <a
                      className="delete-icon"
                      onClick={event => this.showDialogueBox(question.id)}
                    >
                      <img
                        src={require('../assets/images/delete-icon.png')}
                        alt=""
                      />
                    </a>
                  </td>
                </tr>
              ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </div>
    )
  }
}