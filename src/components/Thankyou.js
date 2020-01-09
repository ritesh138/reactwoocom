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

  getOrderData(order_id){
      getOrderById(order_id).then(result => {
          this.setState({ order: result, isLoaded: true })
      });
  }

  componentDidMount() {
    const { data } = this.props.location
    if( data )
    {
      this.getOrderData(data.order_id);
    }
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
              <table className="order_items">
                <tr>
                  <th>Product</th>
                  <th>Total</th>
                </tr>
                { ( this.state.order.line_items ) ? this.state.order.line_items.map((val,index) =>(
                  <tr>
                    <th>  
                      { val.name + ' x ' + val.quantity}                
                    </th>
                    <td>{ val.total }</td>
                  </tr>
                )) : '' }
                <tr>
                  <th>Subtotal</th>
                  <td>{ this.state.order.total}</td>
                </tr>
                <tr>
                  <th>Payment Method</th>
                  <td>{ this.state.order.payment_method}</td>
                </tr>
                <tr>
                  <th>Total</th>
                  <td>{ this.state.order.total}</td>
                </tr>
              </table>
              <br/>
              <h3>Customer Details</h3>
              <table>
                <tr>
                  <th>Billing Details</th>
                  <th>Shipping Details</th>
                </tr>
                <tr>
                  <td>
                    {(this.state.order.billing) ?
                    <table>
                        <tr><td>{ this.state.order.billing.first_name +' '+ this.state.order.billing.last_name }</td></tr>
                        <tr><td>{ this.state.order.billing.company }</td></tr>
                        <tr><td>{ this.state.order.billing.address_1 +' '+ this.state.order.billing.address_2 }</td></tr>
                        <tr><td>{ this.state.order.billing.city +' '+ this.state.order.billing.state+' '+' '+this.state.order.billing.country+' '+this.state.order.billing.postcode }</td></tr>
                        <tr><td>{ this.state.order.billing.email + ' '+this.state.order.billing.phone }</td></tr>
                  </table>
                  : ''}
                  </td>
                  <td>                    
                    {(this.state.order.shipping) ?
                    <table>
                        <tr><td>{ this.state.order.shipping.first_name +' '+ this.state.order.shipping.last_name }</td></tr>
                        <tr><td>{ this.state.order.shipping.company }</td></tr>
                        <tr><td>{ this.state.order.shipping.address_1 +' '+ this.state.order.shipping.address_2 }</td></tr>
                        <tr><td>{ this.state.order.shipping.city +' '+ this.state.order.shipping.state+' '+' '+this.state.order.shipping.country+' '+this.state.order.shipping.postcode }</td></tr>
                  </table>
                  : ''}</td>
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