import React from "react";
import ".././App.css";
import logo from "../images/RollingJobswhite.svg";
import { Link } from "react-router-dom";
import moment from "moment";

const Footer = () => {
  const date = moment().format("YYYY");
  return (
    <div className="searchBar d-flex flex-column">
      <div className="footerWeb d-flex flex-wrap justify-content-center">
        <Link to="/" className="col-sm-12 col-md-4">
          <img className=" logoFooter " src={logo} alt="Logo" />
        </Link>
        <div className="container col-md-8 d-flex justify-content-center">
          <div className="container d-flex flex-wrap align-items-top">
            <div className="col-sm-12 col-md-4 dataInstitucional text-white d-flex flex-column my-2 ">
              <h3 className="tituloFooter d-flex">Institucional</h3>
              <Link
                className="tituloLinks text-decoration-none "
                to="/informacion"
              >
                ¿Quiénes Somos?
              </Link>
              <Link
                className="tituloLinks text-decoration-none "
                to="/contacto"
              >
                Contacto
              </Link>
            </div>
            <div className="col-sm-12 col-md-4 dataCandidatos text-white d-flex flex-column my-2">
              <h3 className="tituloFooter">Candidatos</h3>
              <Link
                className="tituloLinks text-decoration-none "
                to="/faqcandidates"
              >
                Preguntas Frecuentes
              </Link>
              <Link className="tituloLinks text-decoration-none " to="/offers">
                Empleos por Categorías
              </Link>
            </div>
            <div className="col-sm-12 col-md-4 Empresa text-white d-flex flex-column my-2">
              <h3 className="tituloFooter">Empresas</h3>
              <Link
                className="tituloLinks text-decoration-none "
                to="/faqbusiness"
              >
                Preguntas Frecuentes
              </Link>
              <Link className="tituloLinks text-decoration-none " to="/prices">
                Precios
              </Link>
            </div>
          </div>
        </div>
        <p className=" testingRolling text-center text-white mt-3">
          RollingJobs | Copyright ® {date}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Footer;
