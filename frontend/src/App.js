import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [nombre, setNombre] = useState("");
    const [placa, setPlaca] = useState("");
    const [cedula, setCedula] = useState("");
    const [turnos, setTurnos] = useState([]);
    const [mostrarTurnos, setMostrarTurnos] = useState(false);

    // Función para registrar un conductor
    const registrarConductor = () => {
        axios.post("https://enturne-production.up.railway.app/registrar", { nombre, placa, cedula })
            .then(response => {
                alert(response.data.mensaje);
                obtenerTurnos(); // Actualizar turnos después de registrar
            })
            .catch(error => alert("Error al registrar"));
    };

    // Función para obtener los turnos desde el servidor
    const obtenerTurnos = () => {
        axios.get("https://enturne-production.up.railway.app/turnos")
            .then(response => setTurnos(response.data))
            .catch(error => alert("Error al obtener turnos"));
    };

    // Obtener turnos automáticamente al cargar la página
    useEffect(() => {
        obtenerTurnos();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Registro de Conductores</h2>
            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
            />
            <input
                type="text"
                placeholder="Placa"
                value={placa}
                onChange={e => setPlaca(e.target.value)}
            />
            <input
                type="text"
                placeholder="Cedula"
                value={cedula}
                onChange={e => setCedula(e.target.value)}
            />
            <button onClick={registrarConductor}>Registrar</button>

            <hr />

            <button onClick={() => setMostrarTurnos(!mostrarTurnos)}>
                {mostrarTurnos ? "Ocultar Turnos" : "Mostrar Turnos"}
            </button>

            {mostrarTurnos && (
                <table border="1" width="100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Placa</th>
                            <th>Cedula</th>
                            <th>Hora de Llegada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.map((conductor, index) => (
                            <tr key={index}>
                                <td>{conductor.id}</td>
                                <td>{conductor.nombre}</td>
                                <td>{conductor.cedula}</td>
                                <td>{conductor.placa}</td>
                                <td>{new Date(conductor.hora_llegada).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;