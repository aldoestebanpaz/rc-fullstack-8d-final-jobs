import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import CartelCategories from "./CartelCategories";
import axios from "axios";
import searchImage from "../images/search.svg";
import { Link } from "react-router-dom";

const OfertasInicio= (props) => {
  const [data, setdata] = useState([]);
  const getArticles = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/offers/all"
      );
      setdata(response.data);      
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getArticles();
  }, [getArticles]);
  return (
    <div className="bodyPostulates d-flex align-items-center justify-content-center my-5">
      <div className="d-flex flex-column align-items-center">
        <div className="titulares d-flex container align-items-center my-3">
          <h3 className="infoCard col-10">Ofertas de trabajo</h3>
        </div>
        <div className="distriCards d-flex justify-content-around flex-wrap my-5">
          {data.map((a,i) => {
            return (
              <CartelCategories
                titulo={a.title}
                descripcion={a.summary}
                vacantes={a.quota}
                key={i}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OfertasInicio;
