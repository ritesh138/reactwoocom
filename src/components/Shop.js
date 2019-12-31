import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { WooCommerce } from "../service/WoocommerceConnection.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { addToCart } from "../service/WoocommerceFunctions";

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      categories: [],
      allCount: 1
    };
  }

  getData(page) {
    if (page) {
      var page = page;
    } else {
      var page = 1;
    }
    const that = this;
    WooCommerce.getAsync("products?page=" + page).then(function(result) {
      var totalCount = result.headers["x-wp-total"];
      that.setState({
        isLoaded: true,
        items: JSON.parse(result.toJSON().body),
        allCount: totalCount
      });
    });
  }

  getProductCategories() {
    const that = this;
    WooCommerce.getAsync("products/categories").then(function(result) {
      that.setState({
        isLoaded: true,
        categories: JSON.parse(result.toJSON().body)
      });
    });
  }

  componentDidMount() {
    this.getData();
    this.getProductCategories();
  }

  render = () => {
    if (!this.state.isLoaded) {
      return false;
    }
    let table = [];
    let numberOfPages = this.state.allCount / 10;
    for (let i = 0; i < numberOfPages; i++) {
      table.push(i);
    }

    let product_types = ['variable','variable-subscription'];

    return (
      <div>
        <Header />
        <section>
          <div className="container">
            <div className="row">
              <div className="col-sm-3">
                <div className="left-sidebar">
                  <h2>Category</h2>
                  <div className="panel-group category-products" id="accordian">
                    {this.state.categories.map((val, index) => (
                      <div className="panel panel-default">
                        <div className="panel-heading">
                          <h4 className="panel-title">
                            <Link to={"/category/" + val.id}>{val.name}</Link>
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="brands_products">
                    <h2>Brands</h2>
                    <div className="brands-name">
                      <ul className="nav nav-pills nav-stacked">
                        <li>
                          <a href="">
                            {" "}
                            <span className="pull-right">(50)</span>Acne
                          </a>
                        </li>
                        <li>
                          <a href="">
                            {" "}
                            <span className="pull-right">(56)</span>Grüne Erde
                          </a>
                        </li>
                        <li>
                          <a href="">
                            {" "}
                            <span className="pull-right">(27)</span>Albiro
                          </a>
                        </li>
                        <li>
                          <a href="">
                            {" "}
                            <span className="pull-right">(32)</span>Ronhill
                          </a>
                        </li>
                        <li>
                          <a href="">
                            {" "}
                            <span className="pull-right">(5)</span>Oddmolly
                          </a>
                        </li>
                        <li>
                          <a href="">
                            {" "}
                            <span className="pull-right">(9)</span>Boudestijn
                          </a>
                        </li>
                        <li>
                          <a href="">
                            {" "}
                            <span className="pull-right">(4)</span>Rösch
                            creative culture
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="price-range">
                    <h2>Price Range</h2>
                    <div className="well">
                      <input
                        type="text"
                        className="span2"
                        value=""
                        data-slider-min="0"
                        data-slider-max="600"
                        data-slider-step="5"
                        data-slider-value="[250,450]"
                        id="sl2"
                      />
                      <br />
                      <b>$ 0</b> <b className="pull-right">$ 600</b>
                    </div>
                  </div>

                  <div className="shipping text-center">
                    <img src="images/home/shipping.jpg" alt="" />
                  </div>
                </div>
              </div>

              <div className="col-sm-9 padding-right">
                <div className="features_items">
                  <h2 className="title text-center">Features Items</h2>
                  {this.state.items.map((val, index) => (
                    <div className="col-sm-4">
                      <div className="product-image-wrapper">
                        <div className="single-products">
                          <div id={val.id} className="productinfo text-center">
                            <Link to={"/product/" + val.id}>
                              <img src={val.images[0].src} alt="" />
                              <h2>${val.price}</h2>
                              <p>{val.name}</p>
                            </Link>
                            <a
                             style={{display:  ( !product_types.includes(val.type) ) ? 'block' : 'none' }}
                              href="javascript:void(0)"
                              className="btn btn-default add-to-cart"
                              onClick={() => addToCart(val.id)}
                            >
                            <i className="fa fa-shopping-cart"></i>Add to cart
                            </a>
                            <Link class="btn btn-default add-to-cart" style={{display:  ( product_types.includes(val.type) ) ? 'block' : 'none' }} to={"/product/" + val.id}>
                              select option
                            </Link>
                          </div>
                        </div>

                        <div className="choose">
                          <ul className="nav nav-pills nav-justified">
                            <li>
                              <a href="">
                                <i className="fa fa-plus-square"></i>Add to
                                wishlist
                              </a>
                            </li>
                            <li>
                              <a href="">
                                <i className="fa fa-plus-square"></i>Add to
                                compare
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                  <ul class="pagination">
                    {table.map((val, index) => (
                      <li className="active">
                        <a
                          href="javascript:void(0);"
                          onClick={() => {
                            return this.getData(index + 1);
                          }}
                        >
                          {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  };
}
export default Shop;
