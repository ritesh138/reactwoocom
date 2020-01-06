import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Logout } from "../service/WoocommerceFunctions";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }
 
  render() {
    var token = localStorage.getItem('token');
    return (<header id="header">
    <div className="header_top">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <div className="contactinfo">
              <ul className="nav nav-pills">
                <li>
                  <a href="#">
                    <i className="fa fa-phone"></i> +2 95 01 88 821
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-envelope"></i> info@domain.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="social-icons pull-right">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-dribbble"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-google-plus"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="header-middle">
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <div className="logo pull-left">
              <Link to="/">
                <img src="images/home/logo.png" alt="" />
              </Link>
            </div>
            <div className="btn-group pull-right">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-default dropdown-toggle usa"
                  data-toggle="dropdown"
                >
                  USA
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#">Canada</a>
                  </li>
                  <li>
                    <a href="#">UK</a>
                  </li>
                </ul>
              </div>
    
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-default dropdown-toggle usa"
                  data-toggle="dropdown"
                >
                  DOLLAR
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#">Canadian Dollar</a>
                  </li>
                  <li>
                    <a href="#">Pound</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="shop-menu pull-right">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#">
                    <i className="fa fa-user"></i> Account
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-star"></i> Wishlist
                  </a>
                </li>
                <li>
                  <Link to={"/checkout/"}>
                      <i className="fa fa-crosshairs"></i> Checkout
                  </Link>
                </li>
                <li>
                  <Link to="/cart">
                    <i className="fa fa-shopping-cart"></i> Cart
                    </Link>
                </li>
                <li>
                  { ( !token ) ?
                  <Link to="/login">
                    <i className="fa fa-lock"></i> Login
                  </Link> : <Link onClick={ () => Logout() } to="/login">Logout</Link>
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="header-bottom">
      <div className="container">
        <div className="row">
          <div className="col-sm-9">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target=".navbar-collapse"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="mainmenu pull-left">
              <ul className="nav navbar-nav collapse navbar-collapse">
                <li>
                  <Link to="/"> 
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop">Shop</Link>
                </li>
                <li className="dropdown">
                  <a href="#">
                    Blog<i className="fa fa-angle-down"></i>
                  </a>
                  <ul role="menu" className="sub-menu">
                    <li>
                      <a href="blog.html">Blog List</a>
                    </li>
                    <li>
                      <a href="blog-single.html">Blog Single</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="404.html">404</a>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="search_box pull-right">
              <input type="text" placeholder="Search" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </header>
    )
  }
}
export default Header;