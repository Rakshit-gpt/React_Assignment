import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import qs from "qs";
import jwt from "jwt-decode";

function Login() {
  const [getToken, setToken] = useState(null);
  const navigate = useNavigate();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  useEffect(() => {
    if (getToken !== null) {
      navigate("/");
    }
  }, [getToken, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axios
      .post("/users/login", qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        const userData = jwt(res.data.token);
        localStorage.setItem("userName", userData.userName);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      });
  }

  return (
    <Form onSubmit={handleSubmit} className="w-25 m-auto p-4 shadow mt-5">
      <h3 className="text-center">Login</h3>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          ref={passwordRef}
        />
      </Form.Group>
      <p className="text-center">
        Don't have an account,{" "}
        <a href="/register" style={{ textDecoration: "none" }}>
          Create one
        </a>
      </p>
      <div className="text-center">
        <Button variant="primary" type="submit">
          Login
        </Button>
      </div>
    </Form>
  );
}

export default Login;