import { createContext, useContext, useReducer } from "react";
import { roomReducer } from "./roomReducer";
import { createRoom as createRoomApi, joinRoom as joinRoomApi, leaveRoom as leaveRoomApi } from "../apis/room";
import websocket from "../services/websocket";


export const RoomContext = createContext();

const initialRoomState = {
  room: null,
  participants: [],
  loading: false,
  error: null
};

export const RoomProvider = ({ children }) => {

  const [state, dispatch] = useReducer(roomReducer, initialRoomState);



  const createRoom = async (room_name) => {

  dispatch({ type: "ROOM_LOADING" });

  try {

    const createRes = await createRoomApi(room_name);
    localStorage.setItem("room_code", createRes?.code)

    const joinRes = await joinRoomApi(createRes?.code);

    websocket.connect(joinRes.room.code, joinRes.user_id);

    dispatch({
      type: "JOIN_ROOM_SUCCESS",
      payload: {
        room: joinRes.room,
        participants: joinRes.participants
      }
    });

    return joinRes;

  } catch (error) {

    dispatch({
      type: "ROOM_ERROR",
      payload: error.message
    });

    throw error;
  }
};


 
  const joinRoom = async (room_code) => {

    dispatch({ type: "ROOM_LOADING" });

    try {

      const res = await joinRoomApi(room_code);
      localStorage.setItem("room_code", res.room.code)

      websocket.connect(res.room.code, res.user_id);

      dispatch({
        type: "JOIN_ROOM_SUCCESS",
        payload: {
          room : res.room,
          participants : res.participants
        }
      });

      return res;

    } catch (error) {

      dispatch({
        type: "ROOM_ERROR",
        payload: error.message
      });

      throw error;
    }
  };

  


  // LEAVE ROOM
  const leaveRoom = async (room_id) => {

    try {

      await leaveRoomApi(room_id);

      dispatch({ type: "LEAVE_ROOM" });

    } catch (error) {

      dispatch({
        type: "ROOM_ERROR",
        payload: error.message
      });

    }
  };


  return (
    <RoomContext.Provider
      value={{
        ...state,
        createRoom,
        joinRoom,
        leaveRoom
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};


export const useRoom = () => {
  return useContext(RoomContext);
};