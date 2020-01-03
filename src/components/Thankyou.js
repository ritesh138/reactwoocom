import React, { Component } from "react";
import "./../App.css";
import { WooCommerce } from "../service/WoocommerceConnection.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { getOrderById } from "../service/WoocommerceFunctions";

class ThankYou extends Component {
  constructor({
    match: {
      params: { id }
    }
  }) {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      order : []
    };
  }

  getOrderData(){
    var order_id = sessionStorage.getItem("order_id");
    getOrderById(order_id).then(result => {
        this.setState({ order: result, isLoaded: true })
        // console.log(result)
    });
  }

  componentDidMount() {
    this.getOrderData();
  }

  render() {
    return (
      <div>
        <Header />
        <section>
            <div style={{margin: 'auto',width: '50%',padding: '10px'}}>
              <p>ThankYou. Your order has been received.</p>
              <table className="order_review">
                <tr><th>Order ID:</th><td>{ this.state.order.id }</td></tr>
                <tr><th>Date:</th><td>{ this.state.order.date_created }</td></tr>
                <tr><th>Total:</th><td>{ this.state.order.total }</td></tr>
                <tr><th>Payment Method:</th><td>{ this.state.order.payment_method }</td></tr>
              </table>
              <br/>
              <h3>Order details</h3>
              <table>
                <tr className="order_items">
                  <th>Product</th>
                  <th>Total</th>
                </tr>
              </table>
            </div>
        </section>
        <Footer />
      </div>
    );
  }
}
export default ThankYou;