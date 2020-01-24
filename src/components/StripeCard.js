import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Button} from 'react-bootstrap';
import "./../App.css";

const createOptions = () => {
    return {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          fontFamily: 'Open Sans, sans-serif',
          letterSpacing: '0.025em',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#c23d4b',
        },
      }
    }
  };

class Stripecard extends Component {
  constructor(props) {
    super(props);
     this.state = {
             stripetoken: ''
             }
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    console.log(this.props);
      let {token} = await this.props.stripe.createToken({name: "Name"});
        this.setState({ stripetoken: token });
      console.log(token);
  }

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement {...createOptions()} />
         <Button variant="secondary" onClick={this.submit} type="button" className="place_ordr_btn">Place Order</Button>
      </div>
    );
  }
}

export default injectStripe(Stripecard);