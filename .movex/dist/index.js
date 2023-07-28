"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/movex.config.ts
var movex_config_exports = {};
__export(movex_config_exports, {
  default: () => movex_config_default
});
module.exports = __toCommonJS(movex_config_exports);

// src/modules/chat/reducer.ts
var userSlots = {
  pink: true,
  red: true,
  blue: true,
  purple: true,
  green: true,
  orange: true
};
var initialChatState = {
  userSlots,
  messages: []
};
var reducer_default = (state = initialChatState, action) => {
  if (action.type === "join") {
    return {
      ...state,
      userSlots: {
        ...state.userSlots,
        [action.payload.userSlot]: false
      }
    };
  } else if (action.type === "leave") {
    return {
      ...state,
      userSlots: {
        ...state.userSlots,
        [action.payload.userSlot]: true
      }
    };
  } else if (action.type === "submit") {
    const nextMsg = action.payload;
    return {
      ...state,
      messages: [...state.messages, nextMsg]
    };
  }
  return state;
};

// src/movex.config.ts
var movex_config_default = {
  url: "localhost:3333",
  resources: {
    chat: reducer_default
  }
};
