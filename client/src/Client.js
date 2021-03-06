import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "./App";
import { useTwilioVideoRoom } from "./videoClient";
import { useFetch } from "./api";

function Client() {
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [shouldAskforPassword, setShouldAskforPassword] = useState(true);
  const {
    devices,
    joinTwilioRoom,
    connectToLocalTracks,
    hasJoined,
    participants,
    connectParticipantToRef,
  } = useTwilioVideoRoom();
  const { POST } = useFetch();
  const local = useRef();

  useEffect(() => {
    console.log(auth);
    if (!auth.currentUser.roomToken) {
      setShouldAskforPassword(true);
    } else {
      setShouldAskforPassword(false);
      joinTwilioRoom(auth.currentUser.roomToken);
      console.log("connecting");
    }
    console.log(devices);
  }, [auth.currentUser]);

  console.log(participants);

  useEffect(() => {
    connectToLocalMedia();
  }, [hasJoined]);

  useEffect(() => {
    console.log(participants);
  }, [participants]);

  async function connectToLocalMedia() {
    if (hasJoined) {
      connectToLocalTracks(local);
    }
  }

  async function joinRoom() {
    const r = await POST(`room/join`, {
      roomName: id,
      password: "1234",
    });
    auth.setCurrentUser({ ...auth.currentUser, roomToken: r.body.token });
  }

  return (
    <div>
      Room: {id}
      {shouldAskforPassword && (
        <div>
          <label htmlFor="password">Room Password</label>
          <input id="password"></input>
          <button type="button" onClick={() => joinRoom()}>
            Join
          </button>
        </div>
      )}
      <div ref={local}></div>
      {Array.from(participants.values()).map((p) => (
        <ParticipantScreen
          key={p.sid}
          connect={connectParticipantToRef}
          participant={p}
        />
      ))}
    </div>
  );
}

function ParticipantScreen({ connect, participant }) {
  const ref = useRef();
  useEffect(() => {
    connect(ref, participant);
  }, []);
  return <div ref={ref}></div>;
}
export default Client;
