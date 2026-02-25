import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";


function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", form);
    alert("Register berhasil");
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await API.post("/auth/register", data);
      addToast({
        title: "Register Success",
        description: "You have registered successfully. Please login.",
        color: "success",
      });
      navigate("/");
    } catch (error) {
      addToast({
        title: "Register Failed",
        description:
          error.response?.data?.message || "Register failed. Please try again.",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center max-w-md h-screen m-auto">
      <Card>
        <CardBody className="flex gap-4">
          <h1 className="text-3xl font-bold text-center">REGISTER</h1>
          <Form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input isRequired type="text" placeholder="name" name="name" />
            <Input isRequired type="email" placeholder="email" name="email" />
            <Input
              isRequired
              type="password"
              placeholder="password"
              name="password"
            />
            <div className="flex flex-col w-full gap-0.5">
              <Button type="submit" color="primary" className="w-full">
                Register
              </Button>
              <p className="text-center">or</p>
              <Button color="secondary" className="w-full" as={Link} to="/">
                Login
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Register;
