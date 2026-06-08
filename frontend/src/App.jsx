import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000")
      .then((res) => {
        setMensaje(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Control de Gastos</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;