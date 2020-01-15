import React, { Component } from "react";
import { WooCommerce , WooCommerceV3 } from "./WoocommerceConnection";
import { postData , getData , deleteData } from "./Common";

export const addToCart = (product_id, qty , variation_id ) =>{
    var token = localStorage.getItem('token');
    var cart = localStorage.getItem('cart_content');
    
    var req = {}; var flag = 0;
   
    if( !qty )
    {
        qty = 1;
    }

    if(variation_id){
        var req = {product_id:product_id,quantity:qty,variation_id:variation_id}
    }
    else{
        var req = {product_id:product_id,quantity:qty}
    }
    
    if( token )
    {
        return new Promise((resolve, reject) => {
            postData('wp-json/cocart/v1/add-item', req , token).then((result) => {
                if(result.product_id){
                    resolve('success');
                }
            })
        })
    }
    else{
        var cart_content = [];
        if( variation_id )
        {
            var p_id = variation_id
        }
        else{
            var p_id = product_id
        }

        if( isCart() )
        {
            JSON.parse(cart).map((val,index) => {
                if( ( val.product_id == p_id ) || ( val.variation_id == p_id ) )
                {
                  val.quantity = Number(qty)+Number(val.quantity)
                  val.line_subtotal = parseFloat(val.product_price)*val.quantity
                  var line_item = val
                  flag = 1
                }
                else{
                  var line_item = val
                }
                cart_content.push(line_item);
                localStorage.setItem("cart_content",JSON.stringify(cart_content));
            })
        }
 
        if( flag == 0 )
        {
            getProduct(product_id, variation_id).then(result => {
                console.log(result)
                req['product_name'] = result.name;
                req['product_price'] = result.price;
                req['line_subtotal'] = parseFloat( result.price ) * qty;
                cart_content.push(req); 
                localStorage.setItem("cart_content",JSON.stringify(cart_content));
            })
        }
        return new Promise((resolve, reject) => {
            return resolve('success');
        })
    }
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

export const getAllCountries = () => {
    return new Promise((resolve, reject) => {
    WooCommerceV3.getAsync("data/countries").then(function(result) {
        resolve(JSON.parse(result.toJSON().body));
    })
    });
}

export const getAllStates = (id) => {
    return new Promise((resolve, reject) => {
    WooCommerceV3.getAsync("data/countries/"+id).then(function(result) {
        resolve(JSON.parse(result.toJSON().body));
    })
    });
}

export const removeCartItem = ( cart_item_key , product_id , variation_id ) => {
    var token = localStorage.getItem('token');
    if( token )
    {
        var data = { cart_item_key : cart_item_key }
        return new Promise((resolve, reject) => {
            deleteData('wp-json/cocart/v1/item', data , token).then((result) => {
                resolve(result);
            })
        });
    }
    else{
        return new Promise((resolve, reject) => {
            var cart = localStorage.getItem('cart_content')
            cart = JSON.parse(cart).filter((item, i) => ( item.product_id != product_id ) || ( item.variation_id && item.variation_id != variation_id));
            resolve(cart)
        });
    }
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

export const clearCart = () =>{
    var token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
        postData('wp-json/cocart/v1/clear', '' , token).then((result) => {
            resolve(result)
        })
    });
}

export const createOrder = (data) => {
    return new Promise((resolve, reject) => {
        getAdminToken().then(result => {
            data['customer_id'] = sessionStorage.getItem('user_id');
            postData('wp-json/wc/v3/orders', data , result.token).then((result) => {
                resolve(result)
            })
        })
    })
}

export const getProduct = (product_id , variation_id) => {
    if( variation_id )
    {  
        return new Promise((resolve, reject) => {
            var option = '';
            WooCommerce.getAsync('products/'+product_id).then(function(result) {
                var data = JSON.parse(result.toJSON().body);

                WooCommerceV3.getAsync('products/'+product_id+'/variations/'+variation_id).then(function(res) {
                    var data1 = JSON.parse(res.toJSON().body);
                    
                    data1.attributes.map((val,index) =>{
                        option = option +' '+val.option
                    })
                    data1.name = data.name+' '+option;
                    resolve(data1);
                })
            })
 
        });
    }
    else{
        return new Promise((resolve, reject) => {
            WooCommerce.getAsync('products/'+product_id).then(function(result) {
                resolve(JSON.parse(result.toJSON().body));
            })
        });
    }
}

export const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
    WooCommerceV3.getAsync("customers?email="+email).then(function(result) {
        resolve(JSON.parse(result.toJSON().body));
    })
    });
}

export const getOrderById = (order_id) => {
    return new Promise((resolve, reject) => {
        WooCommerceV3.getAsync("orders/"+order_id).then(function(result) {
            resolve(JSON.parse(result.toJSON().body));
        })
    });
}

export const Logout = () =>{
    localStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
}

export const getLocalcart = () => {
    var cart = localStorage.getItem('cart_content');
    if( cart ) {
        return new Promise((resolve, reject) => {
        resolve(JSON.parse(cart));
        })
    }
}

export const signUp = (req) => {
    return new Promise((resolve, reject) => {
        getAdminToken().then(result => {
            if( result.token )
            {
                postData("wp-json/wc/v3/customers", req , result.token).then((result) => {
                    resolve(result)
                })
            }
        })
    })
}

export const isCart = () => {
    var cart = localStorage.getItem('cart_content');
    if( cart )
    {
        return true;
    }
    else{
        return false;
    }
}

export const getAdminToken = () => {
    var req = { username: 'admin', password: 'sunil1990' };
    return new Promise((resolve, reject) => {
        postData("wp-json/jwt-auth/v1/token", req).then(result => {
            resolve(result)
        });
    })
}

export const getLocalTotals = () => {
    var cart = localStorage.getItem('cart_content');
    var total = 0; var all_totals = {};
    return new Promise((resolve, reject) => {
        JSON.parse(cart).map((val,index) => {
            total += val.line_subtotal;
            all_totals.subtotal = total;
            all_totals.total = total;
        })
        resolve(all_totals);
    })
}