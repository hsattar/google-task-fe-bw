import { useState } from "react";
import "./Modal.css";

export const Modal = ({ isOpen, close, type, planners }) => {
  const [select, setSelect] = useState([]);
  const [task, setTask] = useState([]);

  const postTask = async (task) => {
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        body: JSON.stringify({ task: task, plannerId: "f9ac36a8-2591-453e-923b-d6b93a8d9523" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Fetch Failed");
      const data = await response.json();
      setTask(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = (event) => {
    // console.log(event.key);
    console.log(event);

    if (event.key === "Enter") {
      // TODO: MANSI
      // POST TASKS FUNCTION GOES HERE
      postTask(event.target.value);
      close();
    } else {
      setTask(event.target.value);
    }
  };

  const handleAddPlanner = (event) => {
    console.log(event.key);
    if (event.key === "Enter") {
      // TODO: ASADBEK
      // POST PLANNER FUNCTION GOES HERE
      close();
    }
  };

  return (
    <>
      {type === "task"
        ? isOpen && (
            <>
              <div className="modal__bg" onClick={() => close()}></div>
              <div className="modal__inner">
                <div className="modal__controls" onClick={() => close()}>
                  x
                </div>
                <h2>Create new task</h2>
                <small>Press enter to create</small>
                <input type="text" onKeyUp={(e) => handleAddTask(e)} />
                <p>{task}</p>
                <h3>Choose a planner</h3>
                <div className="modal__planners">
                  {planners?.map((planner) => {
                    return (
                      <div className={planner.id === select ? "option__modal--click" : "option__modal"} onClick={() => setSelect(planner.id)}>
                        {planner.name}
                      </div>
                    );
                  })}
                </div>
              </div>{" "}
            </>
          )
        : isOpen &&
          type === "planner" && (
            <>
              <div className="modal__bg" onClick={() => close()}></div>
              <div className="modal__inner">
                <div className="modal__controls" onClick={() => close()}>
                  x
                </div>
                <h2>Create new planner</h2>
                <small>Press enter to create</small>
                <input type="text" onKeyUp={(e) => handleAddPlanner(e)} />
              </div>
            </>
          )}
    </>
  );
};
