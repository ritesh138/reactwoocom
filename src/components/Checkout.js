import React, { Component } from "react";
import "./../App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { WooCommerce } from "./../service/WoocommerceConnection.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { getCartContent , getCartTotals , getCurrentCurrency , getAllCountries , getAllStates , createOrder } from "../service/WoocommerceFunctions";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
	  isLoaded: false,
	  cart: [],
	  totals: [],
	  currencySymbol: '',
	  countries: [],
	  states: [],
	  different_shipping: true
    };
  }

  handleChange = e => {
	if( ('billing_country' == e.target.name ) || ( 'shipping_country' == e.target.name ) )
	{
		getAllStates(e.target.value).then(result => {
			this.setState({ states: result.states });
		});
	}
	else if( 'different_shipping' == e.target.name )
	{
		this.setState({ different_shipping: !this.state.different_shipping });
	}
  }

  componentDidMount() {
    getCartContent().then(result => {
        this.setState({ cart: result, isLoaded: true });
    });
    getCartTotals().then(result => {
      this.setState({ totals: result, isLoaded: true });
    });
    getCurrentCurrency().then(result => {
      this.setState({ currencySymbol: result.symbol, isLoaded: true });
	});
	getAllCountries().then(result => {
		// console.log(result)
		this.setState({ countries: result, isLoaded: true });
	});
  }

  render() {
    return (
      <div>
		<Header />
        <section id="cart_items">
		<div className="container">
			<div className="breadcrumbs">
				<ol className="breadcrumb">
				  <li><a href="javascript:void(0)">Home</a></li>
				  <li className="active">Check out</li>
				</ol>
			</div>
			<form className="checkout">
			<div className="shopper-info">
				<div className="row">
					<div className="col-sm-6 col-lg-6">
					<div className="row">
						<div className="billing-info">
							<p>Billing Information</p>
							<div className="col-sm-6 col-lg-6">
								<label for="billing_first_name">First Name<input type="text" name="billing_first_name" id="billing_first_name" placeholder="First Name" onChange={ this.handleChange } value={ this.state.billing_first_name }/></label>
							</div>
							<div className="col-sm-6 col-lg-6">
								<label for="billing_last_name">Last Name<input type="text" name="billing_last_name" id="billing_last_name" placeholder="Last Name" onChange={ this.handleChange } value={ this.state.billing_last_name }/></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="billing_company">Company Name<input type="text" name="billing_company" id="billing_company" placeholder="Company Name" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="bbilling_country"> Country
								<select name="billing_country" id="billing_country" value={this.state.selectedCountry} onChange={this.handleChange}>
								<option>-- Country --</option>
								{this.state.countries.map((item, i) => (
								<option value={item.code}>{item.name}</option>
								))}
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="billing_address_1">Street Address<input type="text" name="billing_address_1" id="billing_address_1" placeholder="Street Address1" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
							<input type="text" name="billing_address_2" id="billing_address_2" placeholder="Street Address2" />
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="billing_city">Town/City<input type="text" name="billing_city" id="billing_city" placeholder="City" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="billing_state">State/County
								<select name="billing_state" id="billing_state">
									<option>-- State / Province / Region --</option>
									{this.state.states.map((item, i) => (
									<option value={item.code}>{item.name}</option>
									))}
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="billing_postcode">PostCode / ZIP<input type="text" name="billing_postcode" id="billing_postcode" placeholder="Postcode" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="billing_phone">Phone<input type="text" name="billing_phone" id="billing_phone" placeholder="Phone" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="billing_email">Email address<input type="text" name="billing_email" id="billing_email" placeholder="Email Address" /></label>
							</div>
						</div>
					</div>
					</div>
					<div className="col-sm-6 col-lg-6 clearfix">
					<div className="row">
						<div><label><input type="checkbox" name="different_shipping" id="different_shipping" onChange={ this.handleChange } value={ this.state.different_shipping } /> SHIP TO A DIFFERENT ADDRESS?</label></div>
						<div className="shipping-info" style={{ display: ( !this.state.different_shipping ) ? 'block' : 'none' }} >
							<div className="col-sm-6 col-lg-6">
								<label for="shipping_first_name">First Name<input type="text" name="shipping_first_name" id="shipping_first_name" placeholder="First Name" /></label>
							</div>
							<div className="col-sm-6 col-lg-6">
								<label for="shipping_last_name">Last Name<input type="text" name="shipping_last_name" id="shipping_last_name" placeholder="Last Name" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="shipping_company">Company Name<input type="text" name="shipping_company" id="shipping_company" placeholder="Company Name" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="shipping_country"> Country
								<select name="shipping_country" id="shipping_country" value={this.state.selectedCountry} onChange={this.handleChange} >
									<option>-- Country --</option>
									{this.state.countries.map((item, i) => (
									<option value={item.code}>{item.name}</option>
									))}
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="shipping_address_1">Street Address<input type="text" name="shipping_address_1" id="shipping_address_1" placeholder="Street Address1" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
							<input type="text" name="shipping_address_2" id="shipping_address_2" placeholder="Street Address2" />
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="shipping_city">Town/City<input type="text" name="shipping_city" id="shipping_city" placeholder="City" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="shipping_state">State/County
								<select name="shipping_state" id="shipping_state">
									<option>-- State / Province / Region --</option>
								    {this.state.states.map((item, i) => (
									<option value={item.code}>{item.name}</option>
									))}
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label for="shipping_postcode">PostCode / ZIP <input type="text" name="shipping_postcode" id="shipping_postcode" placeholder="Postcode" /></label>
							</div>
						</div>
						<div className="col-sm-12 col-lg-12">
							<label for="order_comments">Order Notes<textarea name="order_comments" id="order_comments" placeholder="order notes" rows="6"></textarea></label>
						</div>
					</div>
					</div>				
				</div>
			</div>
			<div className="review-payment">
				<h2>Review & Payment</h2>
			</div>

			<div className="table-responsive order_review">
				<table className="table table-condensed">
					<thead>
						<tr className="">
							<th>Product</th>
							<th>Totals</th>
						</tr>
					</thead>
					<tbody>
					{Object.values(this.state.cart).map((item, i) => (
						<tr>
  							<td>{ item.product_name } x { item.quantity }</td>
							<td dangerouslySetInnerHTML={{ __html: this.state.currencySymbol + item.line_subtotal.toFixed(2) }} />
						</tr>
					))}
						<tr>
							<td>Subtotal</td>
							<td dangerouslySetInnerHTML={{ __html: this.state.currencySymbol + this.state.totals.subtotal }} />
						</tr>
						<tr>
							<td>Shipping</td>
							<td>Flat rate</td>
						</tr>
						<tr>
							<td>Total</td>
							<td dangerouslySetInnerHTML={{ __html: this.state.currencySymbol + this.state.totals.total }} />
						</tr>
					</tbody>
				</table>
			</div>
			<div className="row">
				<div className="col-sm-12 col-lg-12">
					<div className="payment-options">
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-sm-12 col-lg-12">
					<div className="place_order_btn">
						<button type="button" className="btn btn-fefault">Place Order</button>
					</div>
				</div>
			</div>
		</form>
		</div>
	</section> 

		<Footer />
      </div>
    );
  }
}
export default Checkout;