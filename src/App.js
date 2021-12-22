import { useEffect, useState } from "react";
import "./App.css";
import { HiOutlinePlusSm } from "react-icons/hi";
import { BsJournalPlus } from "react-icons/bs";
import { Dropdown } from "./components/Dropdown/Dropdown";
import { SingleTask } from "./components/SingleTask/SingleTask";
import { Modal as LKModal } from "./components/Modal/Modal";
import { Modal, Button } from 'react-bootstrap'

function App() {
  const URL = process.env.URL
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([])
  const [planners, setPlanners] = useState([]);
  const [plannerID, setPlannerID] = useState([])
  const [open, setOpen] = useState(false);
  const [openPlanner, setOpenPlanner] = useState(false);
  const [search, setSearch] = useState("")
  const [history, setHistory] = useState(false)
  
  // SELECTED BELOW MEANS THE PLANNER ID
  const [selected, setSelected] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [plannerName, setPlannerName] = useState('')
  const [changes, setChanges] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(3)

  const getAllTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks`);
      if (!response.ok) throw new Error("Fetch Failed");
      const data = await response.json();
      setAllTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks?task=${search}&planner=${selected}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error("Fetch Failed");
      const data = await response.json();
      setTasks(data);
      setHistory(false)
    } catch (error) {
      console.log(error);
    }
  };

  const getPlanners = async () => {
    try {
      const response = await fetch(`http://localhost:3001/planner`);
      if (!response.ok) throw new Error("Fetch Failed");
      const data = await response.json();
      setPlanners(data);
      setPlannerID(data.map(planner => planner.id))
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
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
      const response = await fetch(`http://localhost:3001/planner/${selected}`, {
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
      const response = await fetch(`http://localhost:3001/planner/${selected}`, {
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
  const handleHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/history`)
      if (!response.ok) throw new Error("Fetch Failed");
      const data = await response.json();
      setTasks(data);
      setHistory(true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleChanges = () => {
    setChanges(changes + 1)
  }

  useEffect(() => {
    getTasks();
    getPlanners();
    getAllTasks()
  }, [selected, changes, page, limit]);

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
          {
            history 
            ? <Button variant="success"  className='my-2' onClick={getTasks}>Show Current Tasks</Button>
            : <Button variant="success" className='my-2'  onClick={handleHistory}>Show Completed Tasks</Button>

          }          
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
          
        {
          history ? <p>Completed Tasks:</p> : <p>Tasks still to do:</p>
        }

        <select value={limit} onChange={(e) => setLimit(e.target.value)}>
          <option>1</option>
          <option>3</option>
          <option>5</option>
        </select>

        <div className="d-flex">
          {
            page === 0 ? <Button variant='disabled' style={{ display: 'none' }}>Previous</Button> : 
            <Button variant='success' className="mx-1 my-2" onClick={() => setPage(page - 1)}>Previous</Button>
          }
          {
            allTasks?.length > ((page + 1) * limit) && <Button variant='success' className="mx-1 my-2" onClick={() => setPage(page + 1)}>Next</Button>
          }
        </div>

        {tasks?.map((task) => {
          return <SingleTask key={task.id} task={task.task} id={task.id} taskPlanner={task.plannerId} setDone={(id) => handleDelete(id)} handleChanges={handleChanges} history={history} plannerID={plannerID}/>;
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
