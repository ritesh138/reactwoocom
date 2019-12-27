import React, { Component } from "react";
import WooCommerceAPI from "woocommerce-api";
import { Button } from "react-bootstrap";

const WooCommerce = new WooCommerceAPI({
  url: "http://veronica.codingkloud.com", // Your store URL
  consumerKey: "ck_03e83242fdcbb62a01daebe9c4817741f4c18a36", // Your consumer secret
  consumerSecret: "cs_069ce05d83a89152f983fcdd2d4460c213256009", // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v1" // WooCommerce WP REST API version
});

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  getData() {
    const that = this;
    WooCommerce.getAsync("products?per_page=10").then(function(result) {
      that.setState({
        isLoaded: true,
        items: JSON.parse(result.toJSON().body)
      });
    });
  }
  componentDidMount() {
    this.getData();
  }
 
  render() {
    //console.log(this.state.items, 'items');
    return (<div>
      {this.state.items.map((value, index) => (
     
        <div key={index+1}>
          <img
            style={{ width: "200px", height: "200px" }}
            src={value.images[0].src}
          />
          <h4 id={value.id}>{value.name}</h4>
        </div>
    
    ))}</div>)
  }
}
export default Product;
