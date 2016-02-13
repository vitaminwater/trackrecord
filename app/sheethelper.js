'use strict';

// Enter your own sheet URL, see https://medium.com/@stant/a281ea6ff372 for explanations
const SHEET_URL='https://script.google.com/macros/s/[ SECRET_PART ]/exec';

const sendAction = (action, args=[], method='POST') => {
  return fetch(SHEET_URL + '?action=' + action, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: method=='POST' ? JSON.stringify(args) : null,
  });
};

export const pushNewTrack = (description, tag) => {
  return sendAction('pushNewTrack', [description, tag]);
}

export const endLast = () => {
  return sendAction('endLast');
}

export const resumePrevious = () => {
  return sendAction('resumePrevious');
}

export const getLastTrack = () => {
  return sendAction('getLastTrack', [], 'GET').then((r) => r.json());
}

export const getTags = () => {
  return sendAction('getTags', [], 'GET').then((r) => r.json());
}
