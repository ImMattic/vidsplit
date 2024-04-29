import React, { Component } from "react";
import { useParams } from "react-router-dom";

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
    };
  }

  render() {
    const { roomCode } = this.props;
    return (
      <div>
        <h3>{roomCode}</h3>
        <p>Votes: {this.state.votesToSkip}</p>
        <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
        <p>Host: {this.state.isHost.toString()}</p>
      </div>
    );
  }
}

function RoomWrapper() {
  const { roomCode } = useParams();
  return <Room roomCode={roomCode} />;
}
export default RoomWrapper;
