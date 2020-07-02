import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import home from "./pages/home"
import login_employe from "./pages/login_employe.jsx"
import register_employe from "./pages/register_employe"
import company from "./pages/company"
import company2 from "./pages/company2.jsx"
import offers from "./pages/offers"
import FaqsCandidates from "./pages/faqsCandidates";
import FaqBusiness from "./pages/FaqsBusiness";
import FormJobPostulate from "./components/FormJobPostulate";

function App() {
  return <div>
 <Router>
      <Switch>
        <Route path="/login_employe" component={login_employe}/>
        <Route path="/register_employe" component={register_employe}/>
        <Route path="/company" component={company}/>
        <Route path="/company2" component={company2}/>
        <Route path="/offers" component={offers}/>
        <Route path="/" component={home} />

        <Route path="/faqcandidates" component={FaqsCandidates}> </Route>
        <Route path="/faqbusiness" component={FaqBusiness}> </Route>
        <Route path="/prices"> </Route>
        <Route path="/publicJob" component={FormJobPostulate}> </Route>
        <Route path="/informacion">  </Route>
        <Route path="/prensa"> </Route>
        <Route path="/contacto"> </Route>

      </Switch>
    </Router>
  </div>;
}

export default App;

