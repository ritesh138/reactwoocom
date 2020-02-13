import React, { Component, useState } from "react";
import "./../App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { WooCommerce } from "./../service/WoocommerceConnection.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { getCartContent , getCartTotals , getCurrentCurrency , getAllCountries , getAllStates , createOrder, clearCart , getLocalcart , isCart , getLocalTotals , paymentSubmit} from "../service/WoocommerceFunctions";
import {Elements, StripeProvider} from 'react-stripe-elements';
import Stripecard from './StripeCard';

class Checkout extends Component {
  constructor(state,props) {
    super(state,props);
    this.state = {
      error: null,
	  isLoaded: false,
	  cart: [],
	  totals: [],
	  currencySymbol: '',
	  countries: [],
	  billing_states: [],
	  shipping_states:[],
	  different_shipping: false,
	  billing_first_name: '',
	  billing_last_name: '',
	  billing_company: '',
	  billing_country: '',
	  billing_address_1: '',
	  billing_address_2: '',
	  billing_city: '',
	  billing_state: '',
	  billing_postcode: '',
	  billing_phone: '',
	  billing_email: '',
	  shipping_first_name: '',
	  shipping_last_name: '',
	  shipping_company: '',
	  shipping_country: '',
	  shipping_address_1: '',
	  shipping_address_2: '',
	  shipping_city: '',
	  shipping_state: '',
	  shipping_postcode: '',
	  order_comments: '',
	  dataFromParent: {},
	  stripetoken:{}
	};
	this.handleToken = this.handleToken.bind(this);
  }

  handleToken = (stripetoken) => {
	// console.log(stripetoken);
	this.setState({ stripetoken:stripetoken });
  } 

  handleChange = e => {
	if( ('billing_country' == e.target.name ) && ( 'select' != e.target.value ) )
	{
		getAllStates(e.target.value).then(result => {
			this.setState({ billing_states: result.states });
		});
	}
	else if( ('shipping_country' == e.target.name ) && ( 'select' != e.target.value ) )
	{
		getAllStates(e.target.value).then(result => {
			this.setState({ shipping_states: result.states });
		});
	}
	if( 'different_shipping' == e.target.name )
	{
		this.setState({ different_shipping: !this.state.different_shipping });
	}
	var state = {};
    state[e.target.name] =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState(state);
  }

  checkoutProcess = (e) => {
	  e.preventDefault();
	var req = { 'billing' : {
		first_name : this.state.billing_first_name,
		last_name : this.state.billing_last_name,
		company : this.state.billing_company,
		country : this.state.billing_country,
		address_1 : this.state.billing_address_1,
		address_2 : this.state.billing_address_2,
		city : this.state.billing_city,
		state : this.state.billing_state,
		postcode : this.state.billing_postcode,
		phone : this.state.billing_phone,
		email : this.state.billing_email
		}
	}
	if( this.state.different_shipping )
	{
		req['shipping'] = {
			first_name : this.state.shipping_first_name,
			last_name : this.state.shipping_last_name,
			company : this.state.shipping_company,
			country : this.state.shipping_country,
			address_1 : this.state.shipping_address_1,
			address_2 : this.state.shipping_address_2,
			city : this.state.shipping_city,
			state : this.state.shipping_state,
			postcode : this.state.shipping_postcode
		}
	}
	if( this.state.order_comments )
	{
		req['customer_note'] = this.state.order_comments
	}
	
	var temp_items = [];
	Object.values(this.state.cart).map((item, i) => {
		var line_items = {};
		line_items['product_id'] = item.product_id
		line_items['variation_id'] = item.variation_id
		line_items['quantity'] = item.quantity
		temp_items.push(line_items)
	})
	
	req['line_items'] = temp_items
	req['payment_method'] = "stripe"
	req['set_paid'] = true
	req['shipping_lines'] = [{
		method_id: "free_shipping",
		method_title: "Free Shipping",
		total: "0"
	  }]

	setTimeout(() => { 
		// console.log(this.state.stripetoken.id);
		createOrder(req).then(result => {
	
			if(result.id){
				if (this.state.stripetoken.id) {
					 
					paymentSubmit(result.id, this.state.stripetoken.id).then(result => {
					   console.log(result);
					});
				}
			  
				var token = localStorage.getItem('token');
				if( token )
				{
					clearCart();
				}else{
					localStorage.removeItem("cart_content");
				}
			
				  this.props.history.push({
					pathname: '/thankyou',
					data: { 'order_id' : result.id } // your data array of objects
				})
	
			}
		});
    }, 2000);
  }

  componentDidMount() {
	this.handleToken();
	var token = localStorage.getItem('token');
	if( token )
	{
		getCartContent().then(result => {
			this.setState({ cart: result, isLoaded: true });
		});
		getCartTotals().then(result => {
		  this.setState({ totals: result, isLoaded: true });
		});
	}
	else{
		if( isCart() )
		{
		 getLocalcart().then(result => {
		   this.setState({ cart: result, isLoaded: true });
		 });
		 getLocalTotals().then(result => {
		   this.setState({ totals: result, isLoaded: true });
		 })
		}
	}

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
			<form className="checkout" onSubmit={this.checkoutProcess }>
			<div className="shopper-info">
				<div className="row">
					<div className="col-sm-6 col-lg-6">
					<div className="row">
						<div className="billing-info">
							<p>Billing Information</p>
							<div className="col-sm-6 col-lg-6">
								<label htmlFor="billing_first_name">First Name<input type="text" name="billing_first_name" id="billing_first_name" placeholder="First Name" onChange={ this.handleChange } value={ this.state.billing_first_name }/></label>
							</div>
							<div className="col-sm-6 col-lg-6">
								<label htmlFor="billing_last_name">Last Name<input type="text" name="billing_last_name" id="billing_last_name" placeholder="Last Name" onChange={ this.handleChange } value={ this.state.billing_last_name }/></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="billing_company">Company Name<input type="text" name="billing_company" id="billing_company" placeholder="Company Name" onChange={ this.handleChange } value={ this.state.billing_company } /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="bbilling_country"> Country
								<select name="billing_country" id="billing_country" value={this.state.billing_country} onChange={this.handleChange}>
								<option value="select">-- Country --</option>
								{this.state.countries.map((item, i) => (
								<option value={item.code}>{item.name}</option>
								))}
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="billing_address_1">Street Address<input type="text" name="billing_address_1" id="billing_address_1" value={this.state.billing_address_1} onChange={this.handleChange} placeholder="Street Address1" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
							<input type="text" name="billing_address_2" id="billing_address_2" placeholder="Street Address2" value={this.state.billing_address_2} onChange={this.handleChange}/>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="billing_city">Town/City<input type="text" name="billing_city" id="billing_city" placeholder="City" value={this.state.billing_city} onChange={this.handleChange}/></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="billing_state">State/County
								<select name="billing_state" id="billing_state" value={this.state.billing_state} onChange={this.handleChange}>
									<option>-- State / Province / Region --</option>
									{ ( this.state.billing_country && 'select' != this.state.billing_country) ? this.state.billing_states.map((item, i) => (
									<option value={item.code}>{item.name}</option>
									)): '' }
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="billing_postcode">PostCode / ZIP<input type="text" name="billing_postcode" id="billing_postcode" value={this.state.billing_postcode} onChange={this.handleChange} placeholder="Postcode" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="billing_phone">Phone<input type="text" name="billing_phone" id="billing_phone" value={this.state.billing_phone} onChange={this.handleChange} placeholder="Phone" /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="billing_email">Email address<input type="text" name="billing_email" id="billing_email" value={this.state.billing_email} onChange={this.handleChange} placeholder="Email Address" /></label>
							</div>
						</div>
					</div>
					</div>
					<div className="col-sm-6 col-lg-6 clearfix">
					<div className="row">
						<div><label><input type="checkbox" name="different_shipping" id="different_shipping" onChange={ this.handleChange } value={ this.state.different_shipping } /> SHIP TO A DIFFERENT ADDRESS?</label></div>
						<div className="shipping-info" style={{ display: ( this.state.different_shipping ) ? 'block' : 'none' }} >
							<div className="col-sm-6 col-lg-6">
								<label htmlFor="shipping_first_name">First Name<input type="text" name="shipping_first_name" id="shipping_first_name" placeholder="First Name" value={this.state.shipping_first_name} onChange={this.handleChange} /></label>
							</div>
							<div className="col-sm-6 col-lg-6">
								<label htmlFor="shipping_last_name">Last Name<input type="text" name="shipping_last_name" id="shipping_last_name" placeholder="Last Name" value={this.state.shipping_last_name} onChange={this.handleChange} /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="shipping_company">Company Name<input type="text" name="shipping_company" id="shipping_company" placeholder="Company Name" value={this.state.shipping_company} onChange={this.handleChange} /></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="shipping_country"> Country
								<select name="shipping_country" id="shipping_country" value={this.state.shipping_country} onChange={this.handleChange} >
									<option value="select">-- Country --</option>
									{ this.state.countries.map((item, i) => (
									<option value={item.code}>{item.name}</option>
									))}
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="shipping_address_1">Street Address<input type="text" name="shipping_address_1" id="shipping_address_1" placeholder="Street Address1" value={this.state.shipping_address_1} onChange={this.handleChange}/></label>
							</div>
							<div className="col-sm-12 col-lg-12">
							<input type="text" name="shipping_address_2" id="shipping_address_2" placeholder="Street Address2" value={this.state.shipping_address_2} onChange={this.handleChange}/>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="shipping_city">Town/City<input type="text" name="shipping_city" id="shipping_city" placeholder="City" value={this.state.shipping_city} onChange={this.handleChange}/></label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="shipping_state">State/County
								<select name="shipping_state" id="shipping_state" value={this.state.shipping_state} onChange={this.handleChange}>
									<option>-- State / Province / Region --</option>
								    {( this.state.shipping_country && 'select' != this.state.shipping_country ) ? this.state.shipping_states.map((item, i) => (
									<option value={item.code}>{item.name}</option>
									)) : ''}
								</select>
								</label>
							</div>
							<div className="col-sm-12 col-lg-12">
								<label htmlFor="shipping_postcode">PostCode / ZIP <input type="text" name="shipping_postcode" id="shipping_postcode" placeholder="Postcode"  value={this.state.shipping_postcode} onChange={this.handleChange}/></label>
							</div>
						</div>
						<div className="col-sm-12 col-lg-12">
							<label htmlFor="order_comments">Order Notes<textarea name="order_comments" id="order_comments" placeholder="order notes" rows="6" value={this.state.order_comments} onChange={this.handleChange}></textarea></label>
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
						<tr key={Math.random()}>
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
							<td>Free Shipping</td>
						</tr>
						<tr>
							<td>Total</td>
							<td dangerouslySetInnerHTML={{ __html: this.state.currencySymbol + this.state.totals.total }} />
						</tr>
					</tbody>
				</table>
			</div>
			<div className="row">
			    <div className="col-sm-7 col-lg-7">
				</div>
				<div className="col-sm-5 col-lg-5">
					<div className="available_gateways">
					<StripeProvider apiKey="pk_test_DtysxWqaXNdBN4TgzHCPiJlS">
						<div className="card_box">
						
						<Elements>
							<Stripecard handleToken={this.handleToken} dataFromParent = {this.state.dataFromParent} />
						</Elements>
						</div>
					</StripeProvider>
					</div>
				</div>
			</div>
			{/* <div className="row">
				<div className="col-sm-12 col-lg-12">
					<div className="place_order_btn">
						<button type="button" className="btn btn-fefault" onClick={ () => this.checkoutProcess() }>Place Order</button>
					</div>
				</div>
			</div> */}
		</form>
		</div>
	</section> 

		<Footer />
      </div>
    );
  }
}
export default Checkout;