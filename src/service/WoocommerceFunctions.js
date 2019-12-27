import React, { Component } from "react";
import { WooCommerce , WooCommerceV3 } from "./WoocommerceConnection";
import { postData , getData , deleteData } from "./Common";
import Notifications, {notify} from 'react-notify-toast';

export const addToCart = (product_id, qty) =>{
    var token = localStorage.getItem('token');
    var req = {product_id:product_id,quantity:qty}
    postData('wp-json/cocart/v1/add-item', req , token).then((result) => {
		if(result.product_id){
            notify.show('Added to cart!');
        }
        else{

        }
    })
}

export const getCartContent = () => {
    var token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
        getData('wp-json/cocart/v1/get-cart',token).then((result) => {
            resolve(result);
        })
    });
}

export const getCartTotals = () => {
    var token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
        getData('wp-json/cocart/v1/totals',token).then((result) => {
            resolve(result);
        })
    });
}

export const getCurrentCurrency = () => {
    return new Promise((resolve, reject) => {
    WooCommerceV3.getAsync("data/currencies/current").then(function(result) {
        resolve(JSON.parse(result.toJSON().body));
    })
    });
}

export const removeCartItem = ( cart_item_key ) => {
    var token = localStorage.getItem('token');
    var data = { cart_item_key : cart_item_key }
    return new Promise((resolve, reject) => {
        deleteData('wp-json/cocart/v1/item', data , token).then((result) => {
            resolve(result);
        })
    });
}

export const updateCart = ( cart_item_key, qty ) =>{
    var token = localStorage.getItem('token');
    var req = { cart_item_key: cart_item_key, quantity:qty , refresh_totals:true }
    return new Promise((resolve, reject) => {
        postData('wp-json/cocart/v1/item', req , token).then((result) => {
            resolve(result)
        })
    });
}