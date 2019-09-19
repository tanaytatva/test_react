import axios from 'axios';

export function getQuestions() {
  return axios.get(
    process.env.REACT_APP_API_BASE_URL +'/questions'
  );
}

export function deleteQuestion(id) {
  return axios.delete(
    process.env.REACT_APP_API_BASE_URL + '/questions/' + id
  );
}

export function getRoles() {
  return axios.get(
    process.env.REACT_APP_API_BASE_URL +'/questions/role_index'
  );
}

export function getMappings() {
  return axios.get(
    process.env.REACT_APP_API_BASE_URL +'/questions/mapping_index'
  );
}

export function createQuestion(params) {
  return axios.post(
    process.env.REACT_APP_API_BASE_URL + '/questions',
    params
  );
}

export function editQuestion(params) {
  return axios.put(
    process.env.REACT_APP_API_BASE_URL + '/questions/' + params.id,
    params
  );
}