import React, { Component } from "react";
import { WooCommerce } from "./../service/WoocommerceConnection.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { postData } from "./../service/Common.js";
import { getUserByEmail , signUp  , addToCart , isCart } from "../service/WoocommerceFunctions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      username: "",
      password: "",
      reguser: "",
      regpass: "",
      email: ""
    };
  }

  handleChange = e => {
    var state = {};
    state[e.target.name] =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState(state);
  };

  loginUser = (req) => {
  
    var req_data = { username: this.state.username, password: this.state.password };

    var cart = localStorage.getItem('cart_content');

    if( !req_data )
    {
      var req_data = req;
    }
 
    postData("wp-json/jwt-auth/v1/token", req_data).then(result => {
      if (result.token) {
        localStorage.setItem("token", result.token);
        this.userDetails(result.user_email);
        this.setState({
          message: "User login successfully",
          redirectLogin: true
        });
        if( isCart() )
        {
          JSON.parse(cart).map((val,index) => {
            addToCart(val.product_id, val.quantity , val.variation_id )
          })
          localStorage.removeItem('cart_content');
        }
      } else if (result.data.status === 403) {
        this.setState({ message: result.message });
      }
    });
  };

  userDetails(email) {
    getUserByEmail(email).then(result => {
      sessionStorage.setItem("user_id",result[0].id);
    })
  }

  registerUser(){
    let req = {
        username: this.state.reguser,
        email: this.state.email,
        password: this.state.regpass 
      }
      signUp(req).then(result => {
        if(result.id )
        {
          this.setState({
            message1: "Register user successfully",
            redirectLogin: true
          });
        }
      });
  }

  componentDidMount() {
  
  }

  render() {
    return (
      <div>
        <Header />
        <section id="form">
          <div className="container">
            <div className="row">
              <div className="col-sm-4 col-sm-offset-1">
                <div className="login-form">
                  <h2>Login to your account</h2>
                  {this.state.message}
                  <form action="#">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      onChange={this.handleChange}
                      value={this.state.username}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Passowrd"
                      onChange={this.handleChange}
                      value={this.state.password}
                    />

                    <button
                      type="button"
                      onClick={this.loginUser}
                      className="btn btn-default"
                    >
                      Login
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-sm-1">
                <h2 className="or">OR</h2>
              </div>
              <div className="col-sm-4">
                <div className="signup-form">
                  <h2>New User Signup!</h2>
                  {this.state.message1}
                  <form action="#">
                    <input
                      type="text"
                      name="reguser"
                      placeholder="Name"
                      onChange={this.handleChange}
                      value={this.state.reguser}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      onChange={this.handleChange}
                      value={this.state.email}
                    />
                    <input
                      type="password"
                      name="regpass"
                      placeholder="Password"
                      onChange={this.handleChange}
                      value={this.state.regpass}
                    />
                    <button
                      type="button"
                      onClick={ () => this.registerUser() }
                      className="btn btn-default"
                    >
                      Signup
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}
export default Login;
