import React from "react";

const Card = ({ ticket }) => {
  let prio = ["No Priority", "Low", "High", "Medium", "Urgent"];
  return (
    <div className="card">
      <div className="card-content" >
        <h4 className="ticket-title">{ticket.title}</h4>
        <p className="ticket-status">Status: {ticket.status}</p>
        <p className="ticket-priority">Priority: {prio[ticket.priority]}</p>
        {/* <p className="ticket-user">User: {ticket.userId}</p> */}
      </div>
    </div>
  );
};

export default Card;
