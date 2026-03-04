import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/grocery/";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    refreshItems();
  }, []);

  const refreshItems = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Connection Refused! Is Django running?");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const url = editId ? `${BASE_URL}${editId}/` : BASE_URL;
    const method = editId ? "PATCH" : "POST";

    try {
      await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setName("");
      setEditId(null);
      refreshItems();
    } catch (err) {
      console.error("Submit failed. Check server.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Grocery Bud</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. apple"
          />
          <button type="submit" style={styles.btn}>
            {editId ? "Edit" : "Add"}
          </button>
        </form>

        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.id} style={styles.itemRow}>
              <span style={styles.text}>{item.name}</span>
              <button
                onClick={() => {
                  setName(item.name);
                  setEditId(item.id);
                }}
                style={styles.btn}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    padding: "20px", // Added for mobile spacing
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    color: "#ffffff",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    flex: 5,
    padding: "10px",
    backgroundColor: "black",
    color: "#ffffff",
    border: "1px solid #ff0000",
    borderRadius: "4px",
  },
  btn: {
    padding: "10px 20px",
    backgroundColor: "red",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  list: {
    textAlign: "center",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #444",
  },
  text: {
    color: "#ffffff",
    fontSize: "18px",
  },
};

export default App;
