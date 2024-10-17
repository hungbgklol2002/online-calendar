import httpClient from "../configurations/httpClient"
import { API } from "../configurations/configuration";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp = async (
  username,
  password,
  firstname,
  lastname,
  dob,
  address,
  email
) => {
  const response = await httpClient.post(API.SIGN_UP, {
    username: username,
    password: password,
    firstName: firstname,
    lastName: lastname,
    dob: dob,
    address: address,
    email: email,
  });

  return response;
};