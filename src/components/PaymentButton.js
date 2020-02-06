import React, {Component} from 'react';
import {
  injectStripe,
  PaymentRequestButtonElement,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';

class _PaymentRequestForm extends Component {
  constructor(props) {
    super(props);

    const paymentRequest = props.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
    
      requestPayerName: true,
      requestPayerEmail: true,
    });

    paymentRequest.on('token', ({complete, token, ...data}) => {
      props.handleResult({paymentRequest: {token, data}});
      complete('success');
    });

    paymentRequest.canMakePayment().then((result) => {
      this.setState({canMakePayment: !!result});
    });

    this.state = {
      canMakePayment: false,
      paymentRequest,
    };
  }

  render() {
    return this.state.canMakePayment ? (
      <PaymentRequestButtonElement
        paymentRequest={this.state.paymentRequest}
        className="PaymentRequestButton"
        style={{
          paymentRequestButton: {
            theme: 'light',
            height: '64px',
          },
        }}
      />
    ) : (
      <p>
        Either your browser does not support the Payment Request
        API or you do not have a saved payment method. To try out the Payment
        Request Button, switch to one of{' '}
        <a href="https://stripe.com/docs/stripe-js/elements/payment-request-button#testing">
          the supported browsers
        </a>, and make sure you have a saved payment method.
      </p>
    );
  }
}

export default injectStripe(_PaymentRequestForm);