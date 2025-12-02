import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8000/api/tasks/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Task[] = await response.json();
        setTasks(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
        <h1>Task Dashboard</h1>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
        <h1>Task Dashboard</h1>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Task Dashboard</h1>
      {tasks.length === 0 ? (
        <p>No tasks found. Create some via the API or admin.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "0.75rem",
                backgroundColor: task.is_completed ? "#e6ffe6" : "#fff",
              }}
            >
              <h2 style={{ margin: 0, marginBottom: "0.25rem" }}>
                {task.title}
              </h2>
              {task.description && (
                <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                  {task.description}
                </p>
              )}
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                Status:{" "}
                <strong>
                  {task.is_completed ? "Completed" : "Pending"}
                </strong>
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#777" }}>
                Created at: {new Date(task.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

