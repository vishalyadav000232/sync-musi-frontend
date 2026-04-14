import { ClockFading } from "lucide-react";
import BaseApi from "./base";

export const createRoom = async (payload) => {
  try {

    const response = await BaseApi.post("/rooms/create", null ,{
      params:{
        name : payload
      }
    });

    console.log("Room created:", response?.data);

    return response?.data;

  } catch (error) {

    console.error(
      "ROOM_CREATE FAILED:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.detail || "ROOM_CREATE FAILED"
    );

  }
};



export const joinRoom = async (roomCode) => {
  try {

    const response = await BaseApi.post("/rooms/join-by-code",null , {
      params: {
        room_code: roomCode
      }
    });
 

    return response.data;

  } catch (error) {

    console.error(
      "JOIN FAILED:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.detail || "JOIN FAILED"
    );
  }
};


export const leaveRoom = async (roomId) => {
  try {

    const response = await BaseApi.post(`/rooms/${roomId}/leave`);

    console.log("Left room:", response.data);

    return response.data;

  } catch (error) {

    console.error(
      "LEAVE ROOM FAILED:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.detail || "LEAVE ROOM FAILED"
    );

  }
};