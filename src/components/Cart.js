import React, { Component } from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import "./../App.css";
import { removeCartItem , updateCart , getProduct , getCartContent , getCartTotals , getCurrentCurrency , getLocalcart , isCart , getLocalTotals } from "../service/WoocommerceFunctions";
import { Link } from "react-router-dom";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
	  cart: [],
	  totals: [],
	  currencySymbol: '',
	  quantity: []
    };
  }

  handleChange = e => {
    var state = {};
    state[e.target.name] =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState(state);
  }

  changeQty( cart_item_key , product_id , qty , variation_id ){
    var token = localStorage.getItem('token');
    var cart = localStorage.getItem('cart_content');
    if( token )
    {
      updateCart(cart_item_key,qty).then(result => {
        getCartContent().then(result => {
            this.setState({ cart: result, isLoaded: true });
        });
        getCartTotals().then(result => {
          this.setState({ totals: result, isLoaded: true });
        });
      });
    }
    else{
      var updated_cart = [];
      JSON.parse(cart).map((val,index) => {
          if( variation_id && ( variation_id  == val.variation_id ) )
          {
            val.quantity = qty
            val.line_subtotal = parseFloat(val.product_price)*qty
            var line_item = val
          }
          else if( !variation_id && (product_id == val.product_id ) )
          {
            val.quantity = qty
            val.line_subtotal = parseFloat(val.product_price)*qty
            var line_item = val
          }
          else{
            var line_item = val
          }
          updated_cart.push(line_item);
      })
      localStorage.setItem('cart_content', JSON.stringify( updated_cart ) );
      getLocalcart().then(result => {
        this.setState({ cart: result  })
      });
      getLocalTotals().then(result =>{
        this.setState({ cart: result  })
      })
    }
  }

  removeItem( cart_item_key , product_id , variation_id ){
    var token = localStorage.getItem('token');
    if( token )
    {
      removeCartItem(cart_item_key).then(result => {
        getCartContent().then(result => {
            this.setState({ cart: result, isLoaded: true });
        });
        getCartTotals().then(result => {
          this.setState({ totals: result, isLoaded: true });
        });
      });
    }
    else{
      removeCartItem(cart_item_key , product_id , variation_id ).then(result => {
        localStorage.setItem('cart_content', JSON.stringify( result )  );
        getLocalcart().then(res => {
          this.setState({ cart: res} , function(){
            this.componentDidMount();
          });
        })
      });
    }
  }

  getProductImage(id){
    getProduct(id).then(result => {
      return ( result );
    })
  }
  
  componentDidMount() {

    getCurrentCurrency().then(result => {
      this.setState({ currencySymbol: result.symbol, isLoaded: true });
    });

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
       else{
        this.setState({ cart: [], isLoaded: true });
       }
    }
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <Header />
          <section id="cart_items">
            <div className="container">
              <div className="breadcrumbs">
                <ol className="breadcrumb">
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li className="active">Shopping Cart</li>
                </ol>
              </div>
              <div className="table-responsive cart_info">
                <table className="table table-condensed">
                  <thead>
                    <tr className="cart_menu">
                      <td className="image">Item</td>
                      <td className="description"></td>
                      <td className="price">Price</td>
                      <td className="quantity">Quantity</td>
                      <td className="total">Total</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    { ( Object.keys(this.state.cart).length > 0 ) ? Object.values(this.state.cart).map((item) => (
                      <tr key={ item.product_id }>
                        <td className="cart_product">
                          <a href="javascript:void(0)">
                            <img src="" alt="" />
                          </a>
                        </td>
                        <td className="cart_description">
                          <h4>
                            <a href="javascript:void(0)">{item.product_name}</a>
                          </h4>
                        </td>
                        <td className="cart_price">
                          <p>{ item.product_price }</p>
                        </td>
                        <td className="cart_quantity">
                          <div className="cart_quantity_button">
                            <a className="cart_quantity_down" href="javascript:void(0)" onClick={() => this.changeQty( item.key , item.product_id , --item.quantity , item.variation_id )}> - </a>
                            <input
                              className="cart_quantity_input"
                              type="text"
                              name="quantity"
                              onChange={this.handleChange}
                              value={ item.quantity }
                              size="2"
                            />
                            <a className="cart_quantity_up" href="javascript:void(0)" onClick={() => this.changeQty(  item.key , item.product_id , ++item.quantity , item.variation_id )} > + </a>
                          </div>
                        </td>
                        <td className="cart_total">
                          <p className="cart_total_price" dangerouslySetInnerHTML={{ __html: this.state.currencySymbol + item.line_subtotal }} />
                        </td>
                        <td className="cart_delete">
                          <a className="cart_quantity_delete" href="javascript:void(0)" onClick={() => this.removeItem(item.key,item.product_id,item.variation_id)}>
                            <i className="fa fa-times"></i>
                          </a>
                        </td>
                      </tr>
                    )) : <tr><td className="emptyClass" colSpan="6">Your cart is empty.</td></tr> }
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="do_action">
            <div className="container">
              <div className="heading">
                <h3>What would you like to do next?</h3>
                <p>
                  Choose if you have a discount code or reward points you want
                  to use or would like to estimate your delivery cost.
                </p>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="chose_area">
                    <ul className="user_option">
                      <li>
                        <input type="checkbox" />
                        <label>Use Coupon Code</label>
                      </li>
                      <li>
                        <input type="checkbox" />
                        <label>Use Gift Voucher</label>
                      </li>
                      <li>
                        <input type="checkbox" />
                        <label>Estimate Shipping & Taxes</label>
                      </li>
                    </ul>
                    <ul className="user_info">
                      <li className="single_field">
                        <label>Country:</label>
                        <select>
                          <option>United States</option>
                          <option>Bangladesh</option>
                          <option>UK</option>
                          <option>India</option>
                          <option>Pakistan</option>
                          <option>Ucrane</option>
                          <option>Canada</option>
                          <option>Dubai</option>
                        </select>
                      </li>
                      <li className="single_field">
                        <label>Region / State:</label>
                        <select>
                          <option>Select</option>
                          <option>Dhaka</option>
                          <option>London</option>
                          <option>Dillih</option>
                          <option>Lahore</option>
                          <option>Alaska</option>
                          <option>Canada</option>
                          <option>Dubai</option>
                        </select>
                      </li>
                      <li className="single_field zip-field">
                        <label>Zip Code:</label>
                        <input type="text" />
                      </li>
                    </ul>
                    <a className="btn btn-default update" href="">
                      Get Quotes
                    </a>
                    <a className="btn btn-default check_out" href="">
                      Continue
                    </a>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="total_area">
                    <ul>
                      <li>
					Cart Sub Total <span dangerouslySetInnerHTML={{ __html: this.state.currencySymbol + this.state.totals.subtotal }} />
                      </li>
                      <li>
                        Shipping Cost <span>Free</span>
                      </li>
                      <li>
					Total <span dangerouslySetInnerHTML={{ __html: this.state.currencySymbol + this.state.totals.total }} />
                      </li>
                    </ul>
                    <a className="btn btn-default update" href="">
                      Update
                    </a>
                    <Link className="btn btn-default check_out" to={"/checkout/"}>
                      Check Out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
export default Cart;