import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [now, setNow] = useState(new Date());
  const [proofTaskId, setProofTaskId] = useState(null);
  const [proof, setProof] = useState("");
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onOpenChange: onAddChange,
  } = useDisclosure();
  const {
    isOpen: isProofOpen,
    onOpen: onProofOpen,
    onOpenChange: onProofChange,
  } = useDisclosure();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      addToast({
        title: "Fetch Tasks Failed",
        description: error.response?.data?.message || "Failed to fetch tasks.",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addTask = async () => {
    try {
      await API.post("/tasks", { title });
      addToast({
        title: "Add Task Success",
        description: "Task added successfully.",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Add Task Failed",
        description: error.response?.data?.message || "Failed to add task.",
        color: "danger",
      });
    }

    setTitle("");
    fetchTasks();
  };

  const startTask = async (id) => {
    try {
      await API.put(`/tasks/${id}/start`);
      addToast({
        title: "Start Task Success",
        description: "Task started successfully.",
        color: "success",
      });
      fetchTasks();
    } catch (error) {
      addToast({
        title: "Start Task Failed",
        description: error.response?.data?.message || "Failed to start task.",
        color: "danger",
      });
    }
  };

  const handleEndClick = (taskId) => {
    setProofTaskId(taskId);
    setProof("");
    onProofOpen();
  };

  const submitProof = async () => {
    try {
      await API.put(`/tasks/${proofTaskId}/end`, { proof });
      onProofChange(false);
      fetchTasks();
    } catch (error) {
      addToast({
        title: "End Task Failed",
        description: error.response?.data?.message || "Failed to end task.",
        color: "danger",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const activeColumns = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "duration", label: "Duration (mins)" },
    { key: "actions", label: "Actions" },
  ];

  const completedColumns = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "duration", label: "Duration (mins)" },
    { key: "proof", label: "Proof" },
  ];

  const activeTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "in_progress",
  );
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const createRows = (taskArray) =>
    taskArray.map((task) => {
      let duration = task.duration_minutes || 0;
      if (task.status === "in_progress" && task.start_time) {
        duration = Math.floor((now - new Date(task.start_time)) / 60000);
      }

      return {
        key: task.id,
        id: task.id,
        title: task.title,
        status: task.status,
        duration,
        proof: task.proof || "-",
      };
    });

  const activeRows = createRows(activeTasks);
  const completedRows = createRows(completedTasks);

  return (
    <div className="flex flex-col max-w-3xl mx-auto">
      <div className="flex w-full justify-between items-center p-4">
        <Button color="danger" onPress={logout}>
          Logout
        </Button>
        <Button onPress={onAddOpen} color="primary">
          Add Task
        </Button>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-8">
          <h1 className="text-xl font-bold text-center">Active Tasks</h1>
          <Table removeWrapper={true}>
            <TableHeader columns={activeColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={activeRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => {
                    if (columnKey === "actions") {
                      return (
                        <TableCell>
                          {item.status === "pending" && (
                            <Button
                              onPress={() => startTask(item.id)}
                              color="success"
                            >
                              Start
                            </Button>
                          )}
                          {item.status === "in_progress" && (
                            <Button
                              onPress={() => handleEndClick(item.id)}
                              color="danger"
                            >
                              End
                            </Button>
                          )}
                        </TableCell>
                      );
                    }
                    return <TableCell>{item[columnKey]}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <h1 className="text-xl font-bold text-center">Completed Tasks</h1>
          <Table removeWrapper={true}>
            <TableHeader columns={completedColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={completedRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => {
                    return <TableCell>{item[columnKey]}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isAddOpen} onOpenChange={onAddChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add new task</ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addTask();
                    onClose();
                  }}
                  className="flex flex-col gap-4"
                >
                  <Input
                    isRequired
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                  />
                  <Button type="submit" color="primary" className="mx-auto">
                    Submit
                  </Button>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isProofOpen} onOpenChange={onProofChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>End Task & Submit Proof</ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitProof();
                    onClose();
                  }}
                  className="flex flex-col gap-4"
                >
                  <Input
                    isRequired
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    placeholder="Enter proof"
                  />
                  <Button type="submit" color="primary" className="mx-auto">
                    Submit
                  </Button>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Dashboard;
