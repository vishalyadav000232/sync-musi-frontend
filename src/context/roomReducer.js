export const roomReducer = (state, action) => {

  switch (action.type) {

    case "ROOM_LOADING":
      return {
        ...state,
        loading: true,
        error: null
      };

    case "CREATE_ROOM_SUCCESS":
      return {
        ...state,
        loading: false,
        room: action.payload
      };

    case "JOIN_ROOM_SUCCESS":
      return {
        ...state,
        loading: false,
        room: action.payload.room,
        participants: action.payload.participants,
        currentUser: action.payload.user_id
      };

    case "SET_PARTICIPANTS":
      return {
        ...state,
        participants: action.payload
      };

    case "LEAVE_ROOM":
      return {
        ...state,
        room: null,
        participants: []
      };

    case "ROOM_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};