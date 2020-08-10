import React from 'react'
import Swal from "sweetalert2";
// import searchImage from "../images/search.svg";


function CartelCategories(props) {
    const onClick = () => {
        Swal.fire({
            title: "PARA PODER VER MAS OFERTAS DEBE REGISTRARSE",
            showConfirmButton: true,
            width: "auto",
          })
      
    }
    return (
        <div className="card cartelCategories m-3" onClick={onClick}>
            <div className="card-body">
                <h5 className="card-title">{props.titulo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{props.descripcion}</h6>
                <p className="card-text">{props.vacantes} vacantes</p>
            </div>
        </div>





        // <div className="card  cartelCategories">
        //     <div className="card-body">
        //         {/* <img src={searchImage} alt="buscar"/> */}
        //         <h5 className="card-title">{props.titulo}</h5>
        //         <h5 className="card-title">{props.descripcion}</h5>
        //         <p className="card-text">{props.vacantes} vacantes</p>
        //     </div>
        // </div>
        )
}


export default CartelCategories