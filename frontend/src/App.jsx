import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/grocery";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch(BASE_URL)
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const addItem = async () => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setItems([...items, data]);
    setName("");
  };

  const toggle = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/toggle/`, { method: "POST" });
    const updated = await res.json();
    setItems(items.map((i) => (i.id === id ? updated : i)));
  };

  const remove = async (id) => {
    await fetch(`${BASE_URL}/${id}/`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Grocery Bud</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={addItem}>Add</button>

      {items.map((item) => (
        <div key={item.id}>
          <span
            onClick={() => toggle(item.id)}
            style={{
              textDecoration: item.completed ? "line-through" : "none",
              cursor: "pointer",
            }}
          >
            {item.name}
          </span>
          <button onClick={() => remove(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
