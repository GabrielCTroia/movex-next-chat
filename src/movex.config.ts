import { reducer as chatReducer } from './modules/chat/movex';

export default {
  url: 'localhost:3333',
  resources: {
    chat: chatReducer,
  },
};
