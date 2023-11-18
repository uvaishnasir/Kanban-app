import Card from "./Card";
import "../App.css";
import { useState, useEffect } from "react";

const KanbanBoard = () => {
  const [ticketsStore, setTicketsStore] = useState([]);
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState("status");
  const [sort, setSort] = useState("priority");

  let prio = ["No Priority", "Low", "High", "Medium", "Urgent"];

  async function fetchData() {
    try {
      const output = await fetch(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      const data = await output.json();
      console.log(data);

      setTicketsStore(data.tickets);
      console.log(ticketsStore);

      setUsers(data.users);
      console.log(users);
    } catch (error) {
      console.log("Unable to fetch data!");
      setTicketsStore([]);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const groupBy = (key) => {
    if (key == "user") {
      return users;
    }
    return ticketsStore.reduce((result, ticket) => {
      let value = ticket[key];
      console.log(value);

      if (!result[value]) {
        result[value] = [];
      }
      result[value].push(ticket);
      return result;
    }, {});
  };

  const sortBy = (key) => {
    const compare = (a, b) => {
      if (key === "priority") {
        return b[key] - a[key];
      }

      if (key === "title") {
        return a[key].localeCompare(b[key]);
      }

      return 0;
    };

    return [...ticketsStore].sort(compare);
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const saveState = () => {
    let state = JSON.stringify({ group, sort });
    localStorage.setItem("kanban", state);
  };

  const loadState = () => {
    let state = localStorage.getItem("kanban");

    if (state) {
      state = JSON.parse(state);
      setGroup(state.group);
      setSort(state.sort);
    }
  };

  useEffect(() => {
    saveState();
  }, [group, sort]);

  useEffect(() => {
    loadState();
  }, []);

  return (
    <div className="kanban-board">
      <div className="container">
        <div className="kanban-options">
          <label className="kanban-label" htmlFor="group">
            Grouping
          </label>
          <select
            className="kanban-select"
            id="group"
            value={group}
            onChange={handleGroupChange}
          >
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
          <label className="kanban-label" htmlFor="sort">
            Ordering
          </label>
          <select
            className="kanban-select"
            id="sort"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="title">Title</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <h1 className="kanban-title">Kanban Board</h1>
      </div>
      <div className="kanban-columns">
        {group === "status" &&
          Object.keys(groupBy(group)).map((key) => (
            <div className="kanban-column" key={key}>
              <h2 className="kanban-column-title">{key}</h2>
              <div className="kanban-column-list">
                {sortBy(sort)
                  .filter((ticket) => ticket[group] === key)
                  .map((ticket) => (
                    <Card ticket={ticket} key={ticket.id} />
                  ))}
              </div>
            </div>
          ))}
        {group === "priority" &&
          prio.map((p, i) => (
            <div className="kanban-column" key={p}>
              <h2 className="kanban-column-title">{p}</h2>
              <div className="kanban-column-list">
                {ticketsStore
                  .filter((ticket) => ticket.priority === i)
                  .map((ticket) => (
                    <Card ticket={ticket} key={ticket.id} />
                  ))}
              </div>
            </div>
          ))}
        {group === "user" &&
          users.map((user) => (
            <div className="kanban-column" key={user.id}>
              <h2 className="kanban-column-title">{user.name}</h2>
              <div className="kanban-column-list">
                {ticketsStore
                  .filter((ticket) => ticket.userId === user.id)
                  .map((ticket) => (
                    <Card ticket={ticket} key={ticket.id} />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
