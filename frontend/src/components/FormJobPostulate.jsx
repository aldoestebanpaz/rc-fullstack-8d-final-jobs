import React from "react";
import { useState } from "react";
// import Button from './Button'
import Swal from "sweetalert2";
import axios from "axios";

const FormJobPostulate = (props) => {
  const [UserSelec, setUserSelec] = useState({});

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/v1/offers", UserSelec);
      setUserSelec({});
            await Swal.fire({
  icon: 'success',
  title: 'se creo correctamente </br> la oferta',
  showConfirmButton: false,
  width: "auto",  
  timer: 1500
}) 
      // await Swal.fire("genial", "se creo correctamente la oferta", "success");
      // props.crear();
      props.forzar();
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
  };

  const onInputChange = (e) => {
    setUserSelec({
      ...UserSelec,
      [e.target.name]: e.target.value,
      publicationdate: new Date().toLocaleString(),
    });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="titulos my-3">Crear Ofertas</h3>

      <form onSubmit={onsubmit}>
        <div className="form-row">
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="title" className="formLabel">Titulo del Puesto</label>
          <input
            type="text"
            required
            className="form-control "
            name="title"
            placeholder="Titulo del Puesto"
            onChange={onInputChange}
            autoFocus
          />
        </div>
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="summary" className="formLabel">Resumen</label>
          <input
            type="text"
            required
            className="form-control "
            name="summary"
            placeholder="Resumen"
            onChange={onInputChange}
            maxLength="80"
          />
        </div>
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="description" className="formLabel">Descripción</label>
          <textarea
            className="form-control"
            required
            name="description"
            placeholder="Descripción"
            onChange={onInputChange}
          />
        </div>
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="profession" className="formLabel">Profesión</label>
          <input
            type="text"
            required
            className="form-control"
            name="profession"
            placeholder="Profesión"
            onChange={onInputChange}
          />
        </div>
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="workplace" className="formLabel">Lugar de trabajo</label>
          <input
            type="text"
            required
            className="form-control "
            name="workplace"
            placeholder="Lugar de trabajo"
            onChange={onInputChange}
          />
        </div>
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="quota" className="formLabel">Cupo</label>
          <input
            type="number"
            required
            className="form-control"
            name="quota"
            placeholder="Cupo"
            onChange={onInputChange}
          />
        </div>
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="availability" className="formLabel">disponibilidad </label>
          <select
            className="form-control"
            onChange={onInputChange}
            name="availability"
            required
          >
            <option value="">disponibilidad</option>
            <option value="Media jornada">Media Jornada</option>
            <option value="Jornada Completa">Jornada Completa</option>
          </select>
        </div>
        <div className="col-md-6 col-sm-12 form-group">
          <label htmlFor="categories" className="formLabel">Elija una categoria</label>
          <select
            className="form-control"
            onChange={onInputChange}
            name="categories"
            required
          >
            <option value="">elija una categoria</option>
            <option value="informatica">informatica</option>
            <option value="construccion">construccion</option>
          </select>
          </div>
        </div>
  

      <div className="buttonOptions d-flex mb-2">
      <button
                onClick={props.forzar}
                className="btn btn-danger rounded-pill mr-5"
              >
                Cancelar
              </button>
        <button
          type="submit"
          // onClick={() => props.crear(true)}
          className="btn btn-success rounded-pill"
        >
          Crear oferta
        </button>
        {/* <Button className="mr-2" name="Crear oferta" /> */}
        {/* <Button className="mr-2" name="Publicar" /> */}
      </div>
      </form>
    </div>
  );
};

export default FormJobPostulate;
