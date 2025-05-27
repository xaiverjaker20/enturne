import React, { useEffect, useState } from "react";
import axios from "axios";

function Turnos() {
    const [turnos, setTurnos] = useState([]);

    useEffect(() => {
        axios.get("https://enturne-production.up.railway.app/turnos")
            .then(response => setTurnos(response.data))
            .catch(error => alert("Error al obtener turnos"));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Turnos de Conductores</h2>
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
                            <td>{conductor.placa}</td>
                            <td>{conductor.cedula}</td>
                            <td>{new Date(conductor.hora_llegada).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Turnos;