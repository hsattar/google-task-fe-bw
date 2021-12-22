import { useEffect, useState } from "react";
import "./App.css";
import { HiOutlinePlusSm } from "react-icons/hi";
import { BsJournalPlus } from "react-icons/bs";
import { Dropdown } from "./components/Dropdown/Dropdown";
import { SingleTask } from "./components/SingleTask/SingleTask";
import { Modal as LKModal } from "./components/Modal/Modal";
import { Modal, Button } from 'react-bootstrap'

function App() {
  const [tasks, setTasks] = useState([]);
  const [planners, setPlanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPlanner, setOpenPlanner] = useState(false);
  const [search, setSearch] = useState("")
  const [searchResult, setSearchresult] = ([])
  
  // SELECTED BELOW MEANS THE PLANNER ID
  const [selected, setSelected] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [plannerName, setPlannerName] = useState('')
  const [changes, setChanges] = useState(0)
  const getTasks = async () => {
    try {
      const response = await fetch(`https://m6b1tasks-planner-api.herokuapp.com/tasks?task=${search}`);
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
      handleChanges()
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
      handleChanges()
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditPlanner = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://m6b1tasks-planner-api.herokuapp.com/planner/${selected}`, {
        method: 'PUT',
        body: JSON.stringify({ name: plannerName}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Delete Failed')
      handleChanges()
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  // TODO: ROBY SEARCH GOES HERE
  const hanldeSearchTask = async (e) => {
    e.preventDefault()
    handleChanges()
  }

  
  
  // TODO: MANSI HISTORY GETCH GOES HERE

  const handleChanges = () => {
    setChanges(changes + 1)
  }

  useEffect(() => {
    getTasks();
    getPlanners();
  }, [selected, changes]);

  return (
    <>
      <div className="app__wrap">
        <img src="/assets/logo.png" alt="logo" />
        <div className="app__header">
          {selected !== "" && <small onClick={handleDeletePlanner}>Delete planner</small>}
          {selected !== "" && <small onClick={handleShow}>Edit planner</small>}
          
          {/* TODO: ROBY SEARCH GOES HERE */}
          <form onSubmit={hanldeSearchTask}>
            <input
            type="text"
            placeholder="Search Tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ></input>
            <Button className="rounded" type="submit" variant="success" style={{display: "none"}}>Submit</Button>
          </form>

          {/* TODO: MANSI HISTORY GOES HERE */}
          <p>hisotry button</p>
          
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
          return <SingleTask key={task.id} task={task.task} id={task.id} setDone={(id) => handleDelete(id)} handleChanges={handleChanges}/>;
        })}
      </div>
      <LKModal type="task" planners={planners} isOpen={open} close={() => setOpen(false)} handleChanges={handleChanges}/>
      <LKModal type="planner" isOpen={openPlanner} close={() => setOpenPlanner(false)} handleChanges={handleChanges}/>

      <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <form onSubmit={handleEditPlanner}>
          <input type="text" value={plannerName} onChange={e => setPlannerName(e.target.value)}/>
          <Button type="submit" variant="primary" style={{display: "none"}}>
            Submit
          </Button>
        </form>
      </Modal.Body>
    </Modal>
    </>
  );
}

export default App;
