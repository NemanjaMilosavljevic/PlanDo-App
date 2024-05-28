import openSocket from "socket.io-client";

const socket = openSocket(process.env.REACT_APP_RESTAPI_ORIGIN);

export default socket;
