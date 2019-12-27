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