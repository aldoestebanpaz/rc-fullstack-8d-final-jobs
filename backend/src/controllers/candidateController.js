const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const formidable = require("formidable")
const path = require("path");
const fs = require("fs")
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const candidateModel = require("../models/candidateModel");
const uploadImagenModel = require("../models/uploadImageModel");
const uploadCvModel = require("../models/uploadCvModel");
const sendEmail = require("../middlewares/sendEmail");

//crear candidato
exports.createCandidate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { body } = req;

  let user_exists = await candidateModel.findOne({ username: body.username });
  let email_exists = await candidateModel.findOne({ email: body.email });
  let dni_exists = await candidateModel.findOne({ dni: body.dni });
  if (user_exists) {
    return res.status(400).json({ message: "Usuario ya existe..." });
  }
  if (email_exists) {
    return res.status(400).json({ message: "email ya existe..." });
  }
  if (dni_exists) {
    return res.status(400).json({ message: "dni ya existe..." });
  }

  const candidateData = {
    firstname: body.firstname,
    lastname: body.lastname,
    username: body.username,
    email: body.email,
    dni: body.dni,
    age: body.age,
    profession: body.profession,
    publicationdate: body.publicationdate,
    postulantRef: body.postulantRef,
    token: [],
  };

  const salt = await bcryptjs.genSalt(10);
  candidateData.password = await bcryptjs.hash(body.password, salt);

  const user = new candidateModel(candidateData);

  try {
    await user.save();
   
    //----------------------Email------------------------------------------------------------

      let email = candidateData.email;
      let subject = "Registro a RollingJobs";
      let html =  `<div style=" width: 500px">
                      <h1> &#60; Roling<strong style="color:#312f73">Jobs</strong> &#62; </h1>
                      <h2>Felicidades, ahora estas listo para buscar tu empleo soñado &#128578;</h2>
                      <h3>
                      Hola ${candidateData.firstname} ${candidateData.lastname},  el quipo de RollingJobs de ta la bienvenida, ya puedes comenzar con la busqueda de trabajo.
                      </h3>
                    </div>`;

  //     let html=`
  //     <!doctype html>
  //     <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  //       <head>
  //         <title>
  //           RollingJobs | Tu lugar de Trabajo
  //         </title>
  //         <!--[if !mso]><!-- -->
  //         <meta http-equiv="X-UA-Compatible" content="IE=edge">
  //         <!--<![endif]-->
  //         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1">
  //         <style type="text/css">
  //           #outlook a { padding:0; }
  //           body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
  //           table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
  //           img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
  //           p { display:block;margin:13px 0; }
  //         </style>
  //         <!--[if mso]>
  //         <xml>
  //         <o:OfficeDocumentSettings>
  //           <o:AllowPNG/>
  //           <o:PixelsPerInch>96</o:PixelsPerInch>
  //         </o:OfficeDocumentSettings>
  //         </xml>
  //         <![endif]-->
  //         <!--[if lte mso 11]>
  //         <style type="text/css">
  //           .mj-outlook-group-fix { width:100% !important; }
  //         </style>
  //         <![endif]-->
          
  //       <!--[if !mso]><!-->
  //         <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;1,700&display=swap" rel="stylesheet" type="text/css">
  //         <style type="text/css">
  //           @import url(https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;1,700&display=swap);
  //         </style>
  //       <!--<![endif]-->
  
      
          
  //     <style type="text/css">
  //       @media only screen and (min-width:480px) {
  //         .mj-column-per-35 { width:35% !important; max-width: 35%; }
  // .mj-column-per-65 { width:65% !important; max-width: 65%; }
  // .mj-column-per-100 { width:100% !important; max-width: 100%; }
  //       }
  //     </style>
      
    
  //         <style type="text/css">
          
          
  
  //       noinput.mj-menu-checkbox { display:block!important; max-height:none!important; visibility:visible!important; }
  
  //       @media only screen and (max-width:480px) {
  //         .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links { display:none!important; }
  //         .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-inline-links,
  //         .mj-menu-checkbox[type="checkbox"] ~ .mj-menu-trigger { display:block!important; max-width:none!important; max-height:none!important; font-size:inherit!important; }
  //         .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links > a { display:block!important; }
  //         .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-close { display:block!important; }
  //         .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-open { display:none!important; }
  //       }
      
  
  //     @media only screen and (max-width:480px) {
  //       table.mj-full-width-mobile { width: 100% !important; }
  //       td.mj-full-width-mobile { width: auto !important; }
  //     }
    
  //         </style>
          
          
  //       </head>
  //       <body style="background-color:#F2F2F2;">
          
          
  //       <div
  //          style="background-color:#F2F2F2;"
  //       >
          
        
  //       <!--[if mso | IE]>
  //       <table
  //          align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  //       >
  //         <tr>
  //           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  //       <![endif]-->
      
        
  //       <div  style="background:#0c0a59;background-color:#0c0a59;margin:0px auto;max-width:600px;">
          
  //         <table
  //            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#0c0a59;background-color:#0c0a59;width:100%;"
  //         >
  //           <tbody>
  //             <tr>
  //               <td
  //                  style="direction:ltr;font-size:0px;padding:20px 20px 0 20px;text-align:center;"
  //               >
  //                 <!--[if mso | IE]>
  //                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
  //         <tr>
        
  //             <td
  //                class="" style="vertical-align:top;width:196px;"
  //             >
  //           <![endif]-->
              
  //       <div
  //          class="mj-column-per-35 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  //       >
          
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  //       >
          
  //             <tr>
  //               <td
  //                  align="center" style="font-size:0px;word-break:break-word;"
  //               >
                  
          
  //         <div
  //            class="mj-inline-links" style=""
  //         >
          
  //     <!--[if mso | IE]>
      
  //           <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
  //             <tr>
          
  //     <![endif]-->
    
            
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
  //       >
  //         <tbody>
  //           <tr>
  //             <td  style="width:146px;">
                
  //       <img
  //          height="auto" src="https://lh5.googleusercontent.com/0C3vyMg97Pnu7kywicx0kbmm6FlG22_elggmVwst-xj62X9SebohbfDJfipb0JSRpZmo0RHM9wv8dkWgXptg=w1366-h636" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="146"
  //       />
      
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
      
            
  //     <!--[if mso | IE]>
      
  //             </tr></table>
            
  //     <![endif]-->
    
  //         </div>
      
  //               </td>
  //             </tr>
            
  //       </table>
      
  //       </div>
      
  //           <!--[if mso | IE]>
  //             </td>
            
  //             <td
  //                class="" style="vertical-align:top;width:364px;"
  //             >
  //           <![endif]-->
              
  //       <div
  //          class="mj-column-per-65 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  //       >
          
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  //       >
          
  //             <tr>
  //               <td
  //                  align="right" style="font-size:0px;padding:10px 25px;word-break:break-word;"
  //               >
                  
  //       <div
  //          style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:24px;text-align:right;color:#000000;"
  //       ><a href="#" 
  //              style="color: #FFFFFF; text-decoration: none;">CANDIDATOS</a>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;<a href="#" style="color: #FFFFFF; text-decoration: none;">EMPRESAS</a></div>
      
  //               </td>
  //             </tr>
            
  //       </table>
      
  //       </div>
      
  //           <!--[if mso | IE]>
  //             </td>
            
  //         </tr>
        
  //                   </table>
  //                 <![endif]-->
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
          
  //       </div>
      
        
  //       <!--[if mso | IE]>
  //           </td>
  //         </tr>
  //       </table>
        
  //       <table
  //          align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  //       >
  //         <tr>
  //           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  //       <![endif]-->
      
        
  //       <div  style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          
  //         <table
  //            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;"
  //         >
  //           <tbody>
  //             <tr>
  //               <td
  //                  style="direction:ltr;font-size:0px;padding:20px 20px 0 20px;text-align:center;"
  //               >
  //                 <!--[if mso | IE]>
  //                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
  //         <tr>
        
  //             <td
  //                class="" style="vertical-align:top;width:560px;"
  //             >
  //           <![endif]-->
              
  //       <div
  //          class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  //       >
          
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  //       >
          
  //             <tr>
  //               <td
  //                  align="center" style="font-size:0px;padding:30px 40px 10px 40px;word-break:break-word;"
  //               >
                  
  //       <div
  //          style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:32px;font-weight:700;line-height:40px;text-align:center;color:#5FA91D;"
  //       >¡Felicidades! ${candidateData.firstname} ${candidateData.lastname}</div>
      
  //               </td>
  //             </tr>
            
  //             <tr>
  //               <td
  //                  style="font-size:0px;padding:10px 25px;word-break:break-word;"
  //               >
                  
  //       <p
  //          style="border-top:solid 3px #9B9B9B;font-size:1px;margin:0px auto;width:30px;"
  //       >
  //       </p>
        
  //       <!--[if mso | IE]>
  //         <table
  //            align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 3px #9B9B9B;font-size:1px;margin:0px auto;width:30px;" role="presentation" width="30px"
  //         >
  //           <tr>
  //             <td style="height:0;line-height:0;">
  //               &nbsp;
  //             </td>
  //           </tr>
  //         </table>
  //       <![endif]-->
      
      
  //               </td>
  //             </tr>
            
  //             <tr>
  //               <td
  //                  align="center" style="font-size:0px;padding:30px 40px 10px 40px;word-break:break-word;"
  //               >
                  
  //       <div
  //          style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:20px;font-weight:300;line-height:20px;text-align:center;color:#5FA91D;"
  //       >¡Tu Postulación fue aprobada!<br></br> Aguardá al llamado de nuestro Equipo para contiuar con el proceso de Selección</div>
      
  //               </td>
  //             </tr>
            
  //       </table>
      
  //       </div>
      
  //           <!--[if mso | IE]>
  //             </td>
            
  //         </tr>
        
  //                   </table>
  //                 <![endif]-->
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
          
  //       </div>
      
        
  //       <!--[if mso | IE]>
  //           </td>
  //         </tr>
  //       </table>
        
  //       <table
  //          align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  //       >
  //         <tr>
  //           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  //       <![endif]-->
      
        
  //       <div  style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          
  //         <table
  //            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;"
  //         >
  //           <tbody>
  //             <tr>
  //               <td
  //                  style="direction:ltr;font-size:0px;padding:10px 20px;text-align:center;"
  //               >
  //                 <!--[if mso | IE]>
  //                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
  //         <tr>
        
  //             <td
  //                class="" style="vertical-align:top;width:560px;"
  //             >
  //           <![endif]-->
              
  //       <div
  //          class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  //       >
          
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  //       >
          
  //       </table>
      
  //       </div>
      
  //           <!--[if mso | IE]>
  //             </td>
            
  //         </tr>
        
  //                   </table>
  //                 <![endif]-->
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
          
  //       </div>
      
        
  //       <!--[if mso | IE]>
  //           </td>
  //         </tr>
  //       </table>
        
  //       <table
  //          align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  //       >
  //         <tr>
  //           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  //       <![endif]-->
      
        
  //       <div  style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          
  //         <table
  //            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;"
  //         >
  //           <tbody>
  //             <tr>
  //               <td
  //                  style="direction:ltr;font-size:0px;padding:0 20px 20px 20px;text-align:center;"
  //               >
  //                 <!--[if mso | IE]>
  //                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
  //         <tr>
        
  //         </tr>
        
  //                   </table>
  //                 <![endif]-->
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
          
  //       </div>
      
        
  //       <!--[if mso | IE]>
  //           </td>
  //         </tr>
  //       </table>
        
  //       <table
  //          align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  //       >
  //         <tr>
  //           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        
  //         <v:rect  style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
  //         <v:fill  origin="0.5, 0" position="0.5, 0" src="https://lh3.googleusercontent.com/Zm5uvrBHurWxJUsgHWreSf14Ae318H3JeiOnj5mA9Ezrx6CPyH27fv6eilgGE9wxW3iF6gEuIeyNwruN45TYLpnGUkgm18l1lUbhb-Y7upz0TTJ_CfFbWs0-IIMH1nY7X1EseBOt61hachKeznU1MF_wgnXiS8XnCxmO728-2KhgpWZo8KKMFdaQequryUUm0b8IOILhoJ3yidTJNp6kfMo-EGA3ZKZVoE0C6p2Pz9PgRfnSuLphWIdl2nBPvonG3QC5n2tyDbEcBkx2ksM5FIObvoVEfs2qcuIovmB3WdKGQlg6cmNZopCZ5KvSUB8JfLEW3aJ6gwle1f7rCQKGaYZj33gHHzMHWShE6HAPFPs5_4vnDvb1RQly_qdg1uhh8felBcs27_bHwU-uf8INuCZcqKG8VEB5JYW5XH6FBmzas8oD1auctd-JWZosBe6g-YAY_Oc56q1OrDEm03HN4zU1tnzELKL6oH8B0tgdKHPfWJocFduKKh_BWwr381539rOtPPl9RwcH8czC04cW4xegaNi-9Vy36sDgrTT8hLHDWGIdpejz2_dHuZAn1JBa6gjK294HzZtAoA2yRh3iFPj0uCiyDdJpX4wB-4QCzi2ywJ4NIA_MziSDBR0jBepNIPWSGCkXtj45rkdYvfkgjdvSF_UWqqb_V7XrSL-6nqV3p7xaYIkOGtL2cdUIuC4jji0mgA=w1366-h636-ft" color="#0c0a59" type="tile" />
  //         <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
  //       <![endif]-->
            
  //       <div  style="background:#0c0a59 url(https://lh3.googleusercontent.com/Zm5uvrBHurWxJUsgHWreSf14Ae318H3JeiOnj5mA9Ezrx6CPyH27fv6eilgGE9wxW3iF6gEuIeyNwruN45TYLpnGUkgm18l1lUbhb-Y7upz0TTJ_CfFbWs0-IIMH1nY7X1EseBOt61hachKeznU1MF_wgnXiS8XnCxmO728-2KhgpWZo8KKMFdaQequryUUm0b8IOILhoJ3yidTJNp6kfMo-EGA3ZKZVoE0C6p2Pz9PgRfnSuLphWIdl2nBPvonG3QC5n2tyDbEcBkx2ksM5FIObvoVEfs2qcuIovmB3WdKGQlg6cmNZopCZ5KvSUB8JfLEW3aJ6gwle1f7rCQKGaYZj33gHHzMHWShE6HAPFPs5_4vnDvb1RQly_qdg1uhh8felBcs27_bHwU-uf8INuCZcqKG8VEB5JYW5XH6FBmzas8oD1auctd-JWZosBe6g-YAY_Oc56q1OrDEm03HN4zU1tnzELKL6oH8B0tgdKHPfWJocFduKKh_BWwr381539rOtPPl9RwcH8czC04cW4xegaNi-9Vy36sDgrTT8hLHDWGIdpejz2_dHuZAn1JBa6gjK294HzZtAoA2yRh3iFPj0uCiyDdJpX4wB-4QCzi2ywJ4NIA_MziSDBR0jBepNIPWSGCkXtj45rkdYvfkgjdvSF_UWqqb_V7XrSL-6nqV3p7xaYIkOGtL2cdUIuC4jji0mgA=w1366-h636-ft) top center / cover no-repeat;margin:0px auto;max-width:600px;">
  //         <div  style="line-height:0;font-size:0;">
  //         <table
  //            align="center" background="https://lh3.googleusercontent.com/Zm5uvrBHurWxJUsgHWreSf14Ae318H3JeiOnj5mA9Ezrx6CPyH27fv6eilgGE9wxW3iF6gEuIeyNwruN45TYLpnGUkgm18l1lUbhb-Y7upz0TTJ_CfFbWs0-IIMH1nY7X1EseBOt61hachKeznU1MF_wgnXiS8XnCxmO728-2KhgpWZo8KKMFdaQequryUUm0b8IOILhoJ3yidTJNp6kfMo-EGA3ZKZVoE0C6p2Pz9PgRfnSuLphWIdl2nBPvonG3QC5n2tyDbEcBkx2ksM5FIObvoVEfs2qcuIovmB3WdKGQlg6cmNZopCZ5KvSUB8JfLEW3aJ6gwle1f7rCQKGaYZj33gHHzMHWShE6HAPFPs5_4vnDvb1RQly_qdg1uhh8felBcs27_bHwU-uf8INuCZcqKG8VEB5JYW5XH6FBmzas8oD1auctd-JWZosBe6g-YAY_Oc56q1OrDEm03HN4zU1tnzELKL6oH8B0tgdKHPfWJocFduKKh_BWwr381539rOtPPl9RwcH8czC04cW4xegaNi-9Vy36sDgrTT8hLHDWGIdpejz2_dHuZAn1JBa6gjK294HzZtAoA2yRh3iFPj0uCiyDdJpX4wB-4QCzi2ywJ4NIA_MziSDBR0jBepNIPWSGCkXtj45rkdYvfkgjdvSF_UWqqb_V7XrSL-6nqV3p7xaYIkOGtL2cdUIuC4jji0mgA=w1366-h636-ft" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#0c0a59 url(https://lh3.googleusercontent.com/Zm5uvrBHurWxJUsgHWreSf14Ae318H3JeiOnj5mA9Ezrx6CPyH27fv6eilgGE9wxW3iF6gEuIeyNwruN45TYLpnGUkgm18l1lUbhb-Y7upz0TTJ_CfFbWs0-IIMH1nY7X1EseBOt61hachKeznU1MF_wgnXiS8XnCxmO728-2KhgpWZo8KKMFdaQequryUUm0b8IOILhoJ3yidTJNp6kfMo-EGA3ZKZVoE0C6p2Pz9PgRfnSuLphWIdl2nBPvonG3QC5n2tyDbEcBkx2ksM5FIObvoVEfs2qcuIovmB3WdKGQlg6cmNZopCZ5KvSUB8JfLEW3aJ6gwle1f7rCQKGaYZj33gHHzMHWShE6HAPFPs5_4vnDvb1RQly_qdg1uhh8felBcs27_bHwU-uf8INuCZcqKG8VEB5JYW5XH6FBmzas8oD1auctd-JWZosBe6g-YAY_Oc56q1OrDEm03HN4zU1tnzELKL6oH8B0tgdKHPfWJocFduKKh_BWwr381539rOtPPl9RwcH8czC04cW4xegaNi-9Vy36sDgrTT8hLHDWGIdpejz2_dHuZAn1JBa6gjK294HzZtAoA2yRh3iFPj0uCiyDdJpX4wB-4QCzi2ywJ4NIA_MziSDBR0jBepNIPWSGCkXtj45rkdYvfkgjdvSF_UWqqb_V7XrSL-6nqV3p7xaYIkOGtL2cdUIuC4jji0mgA=w1366-h636-ft) top center / cover no-repeat;width:100%;"
  //         >
  //           <tbody>
  //             <tr>
  //               <td
  //                  style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
  //               >
  //                 <!--[if mso | IE]>
  //                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
  //         <tr>
        
  //             <td
  //                class="" style="vertical-align:top;width:600px;"
  //             >
  //           <![endif]-->
              
  //       <div
  //          class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  //       >
          
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  //       >
          
  //             <tr>
  //               <td
  //                  align="center" style="font-size:0px;padding:0px;word-break:break-word;"
  //               >
                  
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
  //       >
  //         <tbody>
  //           <tr>
  //             <td  style="width:600px;">
                
  //       <img
  //          alt="" height="auto" src="http://nimus.de/share/tpl-card/lineshadow.png" style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600"
  //       />
      
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
      
  //               </td>
  //             </tr>
            
  //             <tr>
  //               <td
  //                  align="center" style="font-size:0px;padding:50px 40px 0 40px;word-break:break-word;"
  //               >
                  
  //       <div
  //          style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:center;color:#FFFFFF;"
  //       >En RollingJobs creemos en la acción<br>de conectar a las personas con su trabajo ideal.</br></div>
      
  //               </td>
  //             </tr>
            
  //             <tr>
  //               <td
  //                  align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:100px;word-break:break-word;"
  //               >
                  
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"
  //       >
  //         <tr>
  //           <td
  //              align="center" bgcolor="#5FA91D" role="presentation" style="border:none;border-radius:2px;cursor:auto;mso-padding-alt:15px 30px;background:#5FA91D;" valign="middle"
  //           >
  //             <a
  //                href="http://${process.env.DB_HOST}:${process.env.PORT}/ " style="display:inline-block;background:#5FA91D;color:#FFFFFF;font-family:Poppins, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:2px;" target="_blank"
  //             >
  //               Iniciar Sesión
  //             </a>
  //           </td>
  //         </tr>
  //       </table>
      
  //               </td>
  //             </tr>
            
  //       </table>
      
  //       </div>
      
  //           <!--[if mso | IE]>
  //             </td>
            
  //         </tr>
        
  //                   </table>
  //                 <![endif]-->
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
  //         </div>
  //       </div>
      
  //         <!--[if mso | IE]>
  //         </v:textbox>
  //       </v:rect>
      
  //           </td>
  //         </tr>
  //       </table>
        
  //       <table
  //          align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  //       >
  //         <tr>
  //           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  //       <![endif]-->
      
        
  //       <div  style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          
  //         <table
  //            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;"
  //         >
  //           <tbody>
  //             <tr>
  //               <td
  //                  style="direction:ltr;font-size:0px;padding:50px 0 0 0;text-align:center;"
  //               >
  //                 <!--[if mso | IE]>
  //                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
  //         <tr>
        
  //         </tr>
        
  //                   </table>
  //                 <![endif]-->
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
          
  //       </div>
      
        
  //       <!--[if mso | IE]>
  //           </td>
  //         </tr>
  //       </table>
        
  //       <table
  //          align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  //       >
  //         <tr>
  //           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  //       <![endif]-->
      
        
  //       <div  style="margin:0px auto;max-width:600px;">
          
  //         <table
  //            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
  //         >
  //           <tbody>
  //             <tr>
  //               <td
  //                  style="direction:ltr;font-size:0px;padding:10px 0 20px 0;text-align:center;"
  //               >
  //                 <!--[if mso | IE]>
  //                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
  //         <tr>
        
  //             <td
  //                class="" style="vertical-align:top;width:600px;"
  //             >
  //           <![endif]-->
              
  //       <div
  //          class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  //       >
          
  //       <table
  //          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
  //       >
          
  //             <tr>
  //               <td
  //                  align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
  //               >
                  
  //       <div
  //          style="font-family:Poppins, Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:24px;text-align:center;color:#9B9B9B;"
  //       >RollingJobs | Copyright ® 2020. Todos los derechos reservados. <br></div>
      
  //               </td>
  //             </tr>
            
  //       </table>
      
  //       </div>
      
  //           <!--[if mso | IE]>
  //             </td>
            
  //         </tr>
        
  //                   </table>
  //                 <![endif]-->
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
          
  //       </div>
      
        
  //       <!--[if mso | IE]>
  //           </td>
  //         </tr>
  //       </table>
  //       <![endif]-->
      
      
  //       </div>
      
  //       </body>
  //     </html>
    
      
  //     `

      await sendEmail(email, subject, html);
      

    //----------------------Email------------------------------------------------------------
    res.send({ message: "Se registro usuario correctamente.." });
  } catch (err) {
    res.status(500).send(err);
  }
};

//loguear candidato
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { body } = req;

  let user_in_db = await candidateModel.findOne({ username: body.username });
  if (!user_in_db) {
    return res.status(400).json({ message: "Credenciales no validas." });
  }

  const passCheck = await bcryptjs.compare(body.password, user_in_db.password);
  if (!passCheck) {
    return res.status(400).json({ message: "Credenciales no validas." });
  }

  const jwt_payload = {
    user: {
      id: user_in_db.id,
      username: user_in_db.username,
      role: user_in_db.role,
    },
  };

  try {
    // const token = jsonwebtoken.sign(jwt_payload, process.env.JWT_SECRET, {
    // expiresIn: process.env.TOKEN_EXP_TIME,
    // });
    const token = jsonwebtoken.sign(jwt_payload, process.env.JWT_SECRET);
    user_in_db.token.push(token);
    //user_in_db.token = [token];
    await candidateModel.update({ username: user_in_db.username }, user_in_db);
    res.send({
      message: "Se logueo perfecto",
      token,
      role: user_in_db.role,
      username: user_in_db.username,
    });
  } catch (error) {
    return res.status(500).json({ message: "ERROR DE LOGIN.", error });
  }
};

//desloguear candidato
exports.logout = async (req, res) => {
  try {
    await candidateModel.updateOne(
      { _id: res.locals.user.id },
      { $set: { token: [] } }
    );

    res.json({ message: "Se deslogueo perfecto" });
  } catch (error) {
    res.status(500).send({ message: "ERROR DE LOGOUT.", error });
  }
};

//actualizar datos de candidato
exports.updateCandidate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  if (!res.locals.user.id) {
    return res.status(404).json({ message: "No se encontro candidato..." });
  }

  const { body } = req;

  const user_in_db = await candidateModel
    .find()
    .or({ username: body.username })
    .or({ email: body.email })
    .or({ dni: body.dni });

  const cantidad = user_in_db.length;

  if (cantidad > 1) {
    return res
      .status(400)
      .json({ message: "Nombre de usuario, email, o dni ya existen" });
  }

  try {
    const userNew = {
      firstname: body.firstname,
      lastname: body.lastname,
      username: body.username,
      email: body.email,
      dni: body.dni,
      age: body.age,
      profession: body.profession,
    };
    const salt = await bcryptjs.genSalt(10);
    userNew.password = await bcryptjs.hash(body.password, salt);

    const user = await candidateModel.findByIdAndUpdate(
      res.locals.user.id,
      userNew,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No se encontro candidato..." });
    }

    let userNewData = await candidateModel.findOne(
      { _id: res.locals.user.id },
      "-_id -role -token -password"
    );
    res.send({
      message: "Se actualizaron tus datos correctamente...",
      userNewData,
    });
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar ...." });
  }
};

//borrar candidato
exports.deleteCandidate = async (req, res) => {
  try {
    if (!res.locals.user.id) {
      return res.status(404).json({ message: "No se encontro candidato..." });
    }

    const user = await candidateModel.findByIdAndDelete(res.locals.user.id);

    if (!user) {
      return res.status(404).json({ message: "No se encontro candidato..." });
    }

    return res.status(200).send({ message: "Candidato Eliminado ..." });
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar candidato ..." });
  }
};

//get candidate
exports.editCandidate = async (req, res) => {
  try {
    if (!res.locals.user.id) {
      return res.status(404).json({ message: "No se encontro candidato..." });
    }

    const user = await candidateModel.findById(
      res.locals.user.id,
      "-postulateRef -role -token -_id -publicationdate"
    );

    if (!user) {
      return res.status(404).json({ message: "No se encontro candidato..." });
    }

    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

// cargar imagen de perfil
exports.uploadImages = async (req, res) => {

  try {
    if (!res.locals.user.id){
      return res.status(404).json({ message: "No se encontro candidato..."});
    }

    const candidate = await candidateModel.findById(res.locals.user.id);
    
    if (!candidate) {
      return res.status(404).json({ message: "No se encontro candidato..."});
    }
  } catch (err) {
    res.status(500).send(err);
  }

  const form = formidable({
    hash: 'sha256',
    multiples: true,
    keepExtensions: true
  });

  form.onPart = part => {
    if (['image/jpeg', 'image/png', 'image/gif'].indexOf(part.mime) !== -1) {
        form.handlePart(part);
    }
  };

  form.parse(req, async (err, fields, files) => {
    const filesResult = [];


    for (let fieldName in files) {
      const fieldData = files[fieldName];
      
      if (Array.isArray(fieldData)) {
        fieldData.forEach(f => {
          const filename = path.basename(f.path);
          const newFileLocation = path.join(__dirname, '../public', filename);
          fs.renameSync(f.path, newFileLocation);
          filesResult.push({ 
            fieldName,
            hash: f.hash,
            originalFileName: f.name,
            filename,
            sizeInBytes: f.size,
            mimeType: f.type
          });
        });
      } else {
        const filename = path.basename(fieldData.path);
        const newFileLocation = path.join(__dirname, '../public', filename);
        fs.renameSync(fieldData.path, newFileLocation);
        filesResult.push({ 
          fieldName,
          hash: fieldData.hash,
          originalFileName: fieldData.name,
          filename,
          sizeInBytes: fieldData.size,
          mimeType: fieldData.type
        });
      }
    }

    const upload = new uploadImagenModel({
      resourceType: 'candidate',
      resourceId: new mongoose.Types.ObjectId(res.locals.user.id),
      files: filesResult
    });

    try {
      await upload.save();
      await candidateModel.findByIdAndUpdate(res.locals.user.id, { imageUrl: '/static/' + upload.files[0].filename }, { new: true });
      res.send({
        message: "Se guardo imagen de perfil . . .",
        upload,
      });
    } catch (err) {
      res.status(500).send(err);
    }

  });
};

// cargar cv de candidato
exports.uploadCv = async (req, res) => {

  try {
    if (!res.locals.user.id){
      return res.status(404).json({ message: "No se encontro candidato..."});
    }

    const candidate = await candidateModel.findById(res.locals.user.id);
    
    
    if (!candidate) {
      return res.status(404).json({ message: "No se encontro candidato..."});
    }
  } catch (err) {
    res.status(500).send(err);
  }

  const form = formidable({
    hash: 'sha256',
    multiples: false,
    keepExtensions: true
  });

  form.parse(req, async (err, fields, files) => {
    const filesResult = [];

    for (let fieldName in files) {
      const fieldData = files[fieldName];

        let extencion = /(.docx|.pdf|.doc)$/i;
        if(!extencion.exec(fieldData.path)){
          return res.status(415).json({ message: "Tipo de archivo incorrecto."});
        }
      
      if (Array.isArray(fieldData)) {
        fieldData.forEach(f => {
          const filename = path.basename(f.path);
          const newFileLocation = path.join(__dirname, '../public', filename);
          fs.renameSync(f.path, newFileLocation);
          filesResult.push({ 
            fieldName,
            hash: f.hash,
            originalFileName: f.name,
            filename,
            sizeInBytes: f.size,
            mimeType: f.type
          });
        });
      } else {
        const filename = path.basename(fieldData.path);
        const newFileLocation = path.join(__dirname, '../public', filename);
        fs.renameSync(fieldData.path, newFileLocation);
        filesResult.push({ 
          fieldName,
          hash: fieldData.hash,
          originalFileName: fieldData.name,
          filename,
          sizeInBytes: fieldData.size,
          mimeType: fieldData.type
        });
      }
    }

    const upload = new uploadCvModel({
      resourceType: 'candidate',
      resourceId: new mongoose.Types.ObjectId(res.locals.user.id),
      files: filesResult
    });

    try {
      await upload.save();
      await candidateModel.findByIdAndUpdate(res.locals.user.id, { cv: '/static/' + upload.files[0].filename }, { new: true });
      res.send({
        message: "Se guardo cv de candidato . . .",
        upload,
      });
    } catch (err) {
      res.status(500).send(err);
    }

  });
};