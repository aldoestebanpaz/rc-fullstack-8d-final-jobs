import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory} from "react-router-dom";
import Swal from "sweetalert2";
import auth from "../utils/auth";
import logo from "../images/RollingJobs.svg";
import profilePH from "../images/profile.jpg";
import PostulationInicio from "../components/PostulationInico";
import OfertaInicioUser from "../components/OfertaInicioUser";


const PerfilUser = () => {
  const [display, setdisplay] = useState(1);
  const [UserSelec, setUserSelec] = useState({});
  const [datapostulation, setdatapostulation] = useState([]);
  const [datauser, setdatauser] = useState([]);
  const history = useHistory();

  // TRAE LOS DATOS DE LAS OFERTAS Y POSTULACIONES
  const actualizar = () => {
    getpostulation();
    getuser();
  };
  const getuser = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/offers/candidate/all"
      );
      setdatauser(response.data);
    } catch (error) {
      console.log("no tiene ofertas");
      setdatauser([]);
    }
  }, []);

  const getpostulation = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/offer/postulates/user/all"
      );
      setdatapostulation(response.data);
    } catch (error) {
      console.log("no tiene postulaciones");
      setdatapostulation([]);
    }
  };

  // FUNCIONES DEL FORMULARIO
  const onsubmit = async (e) => {
    e.preventDefault();
    Swal
      .fire({
        title: "Esta seguro?",
        text: "Desea modificar los datos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, modificar!",
      })
      .then(async (result) => {
        if (result.value) {
          try {
            await axios.put(
              "http://localhost:3001/api/v1/users/candidates/",
              UserSelec
            );
            Swal.fire({
              icon: "success",
              text: "modificado correctamente...",
              width: 250,
              showConfirmButton: false,
              timer: 2000,
            });
            // setUserSelec({});
            // setdisplay(1)
          } catch (err) {
            if (err.response.data.message === undefined) {
              Swal.fire(
                `Error de ${err.response.data.errors[0].param}`,
                err.response.data.errors[0].msg,
                "error"
              );
            } else {
              Swal.fire("Oops..", err.response.data.message, "error");
            }
          }
        }
      });
  };
  const onInputChange = (e) => {
    setUserSelec({
      ...UserSelec,
      [e.target.name]: e.target.value,
      publicationdate: new Date().toLocaleString(),
    });
  };

  // TRAE LOS DATOS DEL USUARIO PARA SER EDITADOS
  const getArticles = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:3001/api/v1/users/candidates/edit/"
    );
    setUserSelec(response.data);
    // setUserSelec(response.data)
  }, []);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  // CERRAR SESION
  const signOutHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.get("http://localhost:3001/api/v1/users/candidates/logout");
      auth.logout();
      await Swal.fire("", "sesion cerrada", "success");
      history.push("/");
    } catch (error) {
      Swal.fire("ERROR", "error de deslogueo", "error");
    }
  };

  return (
    <div className=" companyStyle container-fluid">
      <div className="row">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-inline sidebar collapse sidebarMenu sticky-top "
        >
          <Link to="/">
            <img src={logo} alt="logo" loading="lazy" className="logoStyle mb-3" />
          </Link>

          <div className="sidebar-sticky d-flex flex-column justify-content-around mb-3">
  <h2 className="textAdmin text-dark">Bienvenido {UserSelec.username}</h2>

            <img
              src={profilePH}
              alt="logo"
              className="profilePH img-fluid mx-auto d-block rounded-circle"
            />

            <ul className="nav flex-column d-flex mt-5">
              <li className="nav-item">
                <button
                  onClick={() => {setdisplay(1)
                  actualizar()}}
                  className="text-dark btn btn-link"
                >
                  {" "}
                  Modificar Perfil
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => {setdisplay(2)
                    actualizar()}}
                  className="text-dark btn btn-link"
                >
                  {" "}
                  Ver Postulaciones
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => {setdisplay(3)
                    actualizar()
                  }}
                  className="text-dark btn btn-link"
                >
                  {" "}
                  Ofertas Publicadas{" "}
                </button>
              </li>
            </ul>
            <ul className="nav flex-column d-flex mt-5">
              <li className="nav-item">
                <button
                  onClick={signOutHandler}
                  className="text-dark btn btn-link mt-auto"
                >
                  {" "}
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className=" col-md-9 col-lg-10 companyData d-flex flex-column flex-wrap">
          <div className=""></div>
          <div className="">
            {display === 1 ? (
              <div className="container">
                <div className="text-center pb-5 form-group mb-3">
                  <h3 className="mt-4 titulos">Bienvenido</h3>
                  <h5 className="mb-4 texdo">Registro de Candidato</h5>
                  <p className="mb-4 textNews">
                    {" "}
                    Por favor, ingrese sus datos personales para iniciar tu
                    proceso a tu nuevo trabajo.
                  </p>
                  <div className="mb-4">
                    <form onSubmit={onsubmit}>
                      <div className="form-group">
                        <div className=" form-row ">
                          <div className="form-group col-6">
                            <label htmlFor="Name">Nombre</label>
                            <input
                              type="text"
                              required
                              className="form-control "
                              name="firstname"
                              defaultValue={UserSelec.firstname}
                              onChange={onInputChange}
                            />
                          </div>

                          <div className="form-group col-6">
                            <label htmlFor="lastname">Apellido</label>
                            <input
                              type="text"
                              required
                              className="form-control"
                              name="lastname"
                              defaultValue={UserSelec.lastname}
                              onChange={onInputChange}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label htmlFor="dni">Documento</label>
                            <input
                              type="number"
                              required
                              className="form-control"
                              name="dni"
                              defaultValue={UserSelec.dni}
                              onChange={onInputChange}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label htmlFor="profession">
                              Profesión Principal
                            </label>
                            <input
                              type="text"
                              required
                              className="form-control"
                              name="profession"
                              defaultValue={UserSelec.profession}
                              onChange={onInputChange}
                            />
                          </div>

                          <div className="form-group col-md-6">
                            <label htmlFor="exampleInputEmail1">
                              Correo Elctrónico
                            </label>
                            <input
                              type="email"
                              required
                              className="form-control"
                              name="email"
                              aria-describedby="emailHelp"
                              defaultValue={UserSelec.email}
                              onChange={onInputChange}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input
                              type="text"
                              required
                              className="form-control"
                              name="username"
                              defaultValue={UserSelec.username}
                              onChange={onInputChange}
                            />
                          </div>

                          <div className="form-group col-md-3">
                            {" "}
                            <label htmlFor="inputPassword5">Contraseña</label>
                            <input
                              type="password"
                              required
                              defaultValue=""
                              id="inputPassword5"
                              name="password"
                              className="form-control"
                              aria-describedby="passwordHelpBlock"
                              onChange={onInputChange}
                            />
                            <small
                              id="passwordHelpBlock"
                              className="form-text text-muted"
                            >
                              la password debe tener entre 8 y 20 caracteres,
                              contener letras y numeros, tiene que contener por
                              lo menos una mayuscula y una minuscula.
                            </small>
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="exampleInputPassword1">
                              Repita la Contraseña
                            </label>
                            <input
                              type="password"
                              required
                              className="form-control"
                              name="password2"
                              defaultValue=""
                              onChange={onInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        onSubmit={onsubmit}
                        className="btn btn-success rounded-pill"
                      >
                        Confirmar Registro
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {display === 2 ? (
              <div>
                <PostulationInicio
                  get={actualizar}
                  datapostulation={datapostulation}
                />
              </div>
            ) : (
              <></>
            )}
            {display === 3 ? (
              <div>
                <OfertaInicioUser get={actualizar} datauser={datauser} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUser;
