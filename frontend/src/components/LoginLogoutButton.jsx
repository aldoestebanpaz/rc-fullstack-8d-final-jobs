import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { NavLink} from "react-router-dom"
import { Button, Modal } from "react-bootstrap";
import LoginBody from "./LoginBody";
import sweetalert from "sweetalert2";
import axios from "axios";
import auth from "../utils/auth";

function LoginLogoutButton(props) {
  const [photo, setPhoto] = useState(false);
  const handleClose = () => setPhoto(false);
  const handleShow = () => setPhoto(true);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const history = useHistory();


  useEffect( () => {
if (props.user=== null) {
  setUsername(props.user)
} 
  }, []);

  const signOutHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.get(
        "http://localhost:3001/api/v1/users/administrators/logout"
      );
      auth.logout();
      await sweetalert.fire("ADMINISTRADOR", "sesion cerrada", "success");
      setForceUpdate(true);
      // handleClose();
      history.push("/");
      return;
    } catch (error) {
    }

    try {
      await axios.get("http://localhost:3001/api/v1/users/candidates/logout");
      auth.logout();
      await sweetalert.fire("", "sesion cerrada", "success");
      setForceUpdate(true);
      history.push("/");
      handleClose();
    } catch (error) {
      sweetalert.fire("ERROR", "error de deslogueo", "error");
    }
  };

  return (
    <div className="">
      {auth.isAuthenticated() ? (
        <div className="container mx-2">
          <h5 className="text-warning">Bienvenido {username}</h5>
          <button
            onClick={signOutHandler}
            className="btn btn-secondary rounded-pill"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div className="container mx-2">
           <li className="nav-item active mr-2">
                <NavLink className="nav-link text-white" to="/register_employe">
                  Regístrate <span className="sr-only">(current)</span>
                </NavLink>
              </li>
          <Button
            variant="primary"
            className="btn btn-success rounded-pill"
            onClick={handleShow}
          >
            Iniciar Sesión
          </Button>
          <Modal show={photo} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <div className="ml-5 d-flex flex-column align-items-center">
                  <h3 className="ml-4 tituloCartel">Iniciar Sesión</h3>
                  <h5 className="text-center datosCartel">
                    Por Favor, ingrese sus credenciales para continuar
                  </h5>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LoginBody />
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default LoginLogoutButton;
