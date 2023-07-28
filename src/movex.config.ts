import chatReducer from './modules/chat/reducer';

export default {
  url: 'localhost:3333',
  resources: {
    chat: chatReducer,
  },
};
