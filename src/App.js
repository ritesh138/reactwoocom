import React, { Component } from "react";
import Notifications, {notify} from 'react-notify-toast';
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Cart from "./components/Cart.js";
import Shop from "./components/Shop.js";
import ContactUs from "./components/ContactUs.js";
import ProductCategories from "./components/ProductCategories.js";
import SingleProduct from "./components/ProductDetails.js";
import Checkout from "./components/Checkout.js";
import ThankYou from "./components/Thankyou";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Notifications />
        <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/shop" component={Shop} />
            <Route exact path="/contact" component={ContactUs} />
            <Route exact path="/category/:id" component={ProductCategories} />
            <Route exact path="/product/:id" component={SingleProduct} />
            <Route exact path="/checkout/" component={Checkout} />
            <Route exact path="/thankyou/" component={ThankYou} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
