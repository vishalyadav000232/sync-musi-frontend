import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { roomReducer } from "./roomReducer";
import {
  createRoom as createRoomApi,
  joinRoom as joinRoomApi,
  leaveRoom as leaveRoomApi
} from "../apis/room";

import websocket from "../services/websocket";
import { getToken } from "../utils/token_helper";

export const RoomContext = createContext();

const initialRoomState = {
  room: null,
  currentUser: null,
  participants: [],
  loading: false,
  error: null
};

export const RoomProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, initialRoomState);

  // =====================
  // CREATE ROOM
  // =====================
  const createRoom = useCallback(async (room_name) => {
    dispatch({ type: "ROOM_LOADING" });

    try {
      const createRes = await createRoomApi(room_name);

      localStorage.setItem("room_code", createRes?.code);

      const joinRes = await joinRoomApi(createRes?.code);

      const token = getToken();

      websocket.disconnect();
      websocket.connect(joinRes.room.code, joinRes.user_id, token);

      dispatch({
        type: "JOIN_ROOM_SUCCESS",
        payload: {
          room: joinRes.room,
          participants: joinRes.participants,
          currentUser: joinRes.user_id
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
  }, []);

  // =====================
  // JOIN ROOM
  // =====================
  const joinRoom = useCallback(async (room_code) => {
    dispatch({ type: "ROOM_LOADING" });

    try {
      const res = await joinRoomApi(room_code);

      localStorage.setItem("room_code", res.room.code);

      const token = getToken();

      websocket.disconnect();
      websocket.connect(res.room.code, res.user_id, token);

      dispatch({
        type: "JOIN_ROOM_SUCCESS",
        payload: {
          room: res.room,
          participants: res.participants,
          currentUser: res.user_id
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
  }, []);

  // =====================
  // LEAVE ROOM
  // =====================
  const leaveRoom = useCallback(async (room_id) => {
    try {
      const res = await leaveRoomApi(room_id);

      websocket.disconnect();

      localStorage.removeItem("room_code");

      dispatch({ type: "LEAVE_ROOM" });

      return res;
    } catch (error) {
      dispatch({
        type: "ROOM_ERROR",
        payload: error.message
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      createRoom,
      joinRoom,
      leaveRoom
    }),
    [state, createRoom, joinRoom, leaveRoom]
  );

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);