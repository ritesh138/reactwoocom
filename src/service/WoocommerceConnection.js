import React, { Component } from "react";
import WooCommerceAPI from "woocommerce-api";

export const WooCommerce = new WooCommerceAPI({
  url: "http://veronica.codingkloud.com", // Your store URL
  consumerKey: "ck_03e83242fdcbb62a01daebe9c4817741f4c18a36", // Your consumer secret
  consumerSecret: "cs_069ce05d83a89152f983fcdd2d4460c213256009", // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v1" // WooCommerce WP REST API version
});


export const WooCommerceV3 = new WooCommerceAPI({
  url: "http://veronica.codingkloud.com", // Your store URL
  consumerKey: "ck_03e83242fdcbb62a01daebe9c4817741f4c18a36", // Your consumer secret
  consumerSecret: "cs_069ce05d83a89152f983fcdd2d4460c213256009", // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v3" // WooCommerce WP REST API version
});


// export const WooCommerce = new WooCommerceAPI({
//   url: "http://sunilwoostore.000webhostapp.com/", // Your store URL
//   consumerKey: "ck_da6d24a8223c3177a30e84b51450ddc81427f6d6", // Your consumer secret
//   consumerSecret: "cs_88621cfdea898779f5e8a2002c5786721b52c2bc", // Your consumer secret
//   wpAPI: true, // Enable the WP REST API integration
//   version: "wc/v1" // WooCommerce WP REST API version
// });


// export const WooCommerceV3 = new WooCommerceAPI({
//   url: "http://sunilwoostore.000webhostapp.com/", // Your store URL
//   consumerKey: "ck_da6d24a8223c3177a30e84b51450ddc81427f6d6", // Your consumer secret
//   consumerSecret: "cs_88621cfdea898779f5e8a2002c5786721b52c2bc", // Your consumer secret
//   wpAPI: true, // Enable the WP REST API integration
//   version: "wc/v3" // WooCommerce WP REST API version
// });