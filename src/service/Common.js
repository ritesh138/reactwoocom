import React, { Component } from "react";
import { BaseUrl } from "./../Config.js";

export function postData(url, request_data, token) {
  var headers = { 
    "Content-Type": "application/json"
   };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  var BASE_WITH_URL = BaseUrl + url;
  // var BASE_WITH_URL = 'http://localhost/add_to_cart.php';
  return new Promise((resolve, reject) => {
    fetch(BASE_WITH_URL, {
      method: "POST",
      body: JSON.stringify(request_data),
      headers: headers
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
        console.error(error);
      });
  });
}

export function getData(url, token) {
  var headers = { 
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  return new Promise((resolve, reject) => {
    fetch(BaseUrl + url, {
      method: "GET",
      headers: headers,
      data: {
        thumb : true
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
        console.error(error);
      });
  });
}

export function deleteData(url, request_data, token) {
  var headers = { 
    "Content-Type": "application/json"
   };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  return new Promise((resolve, reject) => {
    fetch(BaseUrl + url, {
      method: "DELETE",
      body: JSON.stringify(request_data),
      headers: headers
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
        console.error(error);
      });
  });
}