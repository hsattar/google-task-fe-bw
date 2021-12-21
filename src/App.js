import { useEffect, useState } from "react";
import "./App.css";
import { HiOutlinePlusSm } from "react-icons/hi";
import { BsJournalPlus } from "react-icons/bs";
import { Dropdown } from "./components/Dropdown/Dropdown";
import { SingleTask } from "./components/SingleTask/SingleTask";
import { Modal } from "./components/Modal/Modal";

function App() {
  const [tasks, setTasks] = useState([]);
  const [planners, setPlanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPlanner, setOpenPlanner] = useState(false);
  const [selected, setSelected] = useState("");

  const getTasks = async () => {
    try {
      const response = await fetch(`https://m6b1tasks-planner-api.herokuapp.com/tasks`);
      if (!response.ok) throw new Error("Fetch Failed");
      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPlanners = async () => {
    try {
      const response = await fetch("https://m6b1tasks-planner-api.herokuapp.com/planner");
      if (!response.ok) throw new Error("Fetch Failed");
      const data = await response.json();
      setPlanners(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://m6b1tasks-planner-api.herokuapp.com/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete Failed");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePlanner = async () => {
    try {
      const response = await fetch(`https://m6b1tasks-planner-api.herokuapp.com/planner/${selected}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Delete Failed')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTasks();
    getPlanners();
  }, [selected]);

  return (
    <>
      <div className="app__wrap">
        <img src="/assets/logo.png" alt="logo" />
        <div className="app__header">
          {selected !== "" && <small onClick={handleDeletePlanner}>Delete planner</small>}
          <div className="app__buttons">
            <Dropdown
              planners={planners}
              fetchSelPlanner={(tasks, sel) => {
                setTasks(tasks);
                setSelected(sel);
              }}
            />
            <div className="app__plus" onClick={() => setOpen((op) => !op)}>
              <HiOutlinePlusSm />
            </div>
            <div className="app__plus" onClick={() => setOpenPlanner((op) => !op)}>
              <BsJournalPlus />
            </div>
          </div>
        </div>

        {tasks?.map((task) => {
          return <SingleTask key={task.id} task={task.task} id={task.id} setDone={(id) => handleDelete(id)} />;
        })}
      </div>
      <Modal type="task" planners={planners} isOpen={open} close={() => setOpen(false)} />
      <Modal type="planner" isOpen={openPlanner} close={() => setOpenPlanner(false)} />
    </>
  );
}

export default App;
