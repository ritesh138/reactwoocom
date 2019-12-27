import React, { Component } from "react";
import { BaseUrl } from "./../Config.js";

export function postData(url, request_data, token) {
  var headers = '';

  if(token)
  {
    headers = { 
      "Content-Type": "application/json",
      Authorization: "Bearer " + token }
  }
  else{
    headers = { 
      "Content-Type": "application/json"
    }
  }

  return new Promise((resolve, reject) => {
    fetch(BaseUrl + url, {
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
  return new Promise((resolve, reject) => {
    fetch(BaseUrl + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      data: {
        thumb: true
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
    return new Promise((resolve, reject) => {
      fetch(BaseUrl + url, {
        method: "DELETE",
        body: JSON.stringify(request_data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
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