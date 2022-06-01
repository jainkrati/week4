import styles from "../styles/FormDemo.module.css"
import React from "react";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { providers, Contract, utils } from "ethers";
import Greeter from "../artifacts/contracts/Greeters.sol/Greeters.json";

const FormComponent = (formProps:any) => (
  <div className={styles.app}>
    <h1>Week 4: Basic Form & Input Validation Demo</h1>

    <Formik
      initialValues={{ name: "", age: "", address: "" }}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert(JSON.stringify(values, null, 2));
        console.log(JSON.stringify(values, null, 2));
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required("Required"),
        age: Yup.number().required("Required"),
        address: Yup.string().required("Required")
      })}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className={styles.label} style={{ display: "block" }}>
              Name
            </label>
            <input
              id="name"
              placeholder="Enter your name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className=
                {errors.name && touched.name ? styles.inputError : styles.input
                }
            />
            {errors.name && touched.name && (
              <div className={styles.inputFeedback}>{errors.name}</div>
            )}

            <div style={{ paddingBottom: "0.5em" }} />
            <label htmlFor="age"  className={styles.label} style={{ display: "block" }}>
              Age
            </label>
            <input
              id="age"
              placeholder="Enter your age"
              type="text"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.age && touched.age ? styles.inputError : styles.input
              }
            />
            {errors.age && touched.age && (
              <div className={styles.inputFeedback}>{errors.age}</div>
            )}

            <div style={{ paddingBottom: "0.5em" }} />
            <label htmlFor="address" className={styles.label} style={{ display: "block" }}>
              Address
            </label>
            <input
              id="address"
              placeholder="Enter your address"
              type="text"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.address && touched.address
                  ? styles.inputError : styles.input
              }
            />
            {errors.address && touched.address && (
              <div className={styles.inputFeedback}>{errors.address}</div>
            )}

            <button
              type="button"
              className={styles.button}
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>
            <button type="submit" 
              className={styles.button}
              disabled={isSubmitting}>
              Submit
            </button>
            <label htmlFor="greeting" className={styles.greetingLabel} style={{ display: "block" }}>
              Greeting
            </label>
            <text id="greetingText">{formProps.greeting}</text>
          </form>
        );
      }}
    </Formik>
  </div>
);

export default function FormDemo() {
  const [greeting, setGreeting] = useState("");

  console.log("Adding the listener for greeting");
  const provider = new providers.JsonRpcProvider("http://localhost:8545")
  const contract = new Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", Greeter.abi, provider)

  function addGreetListener() {
    contract.once("NewGreeting", (greetingBytes) => {
      let greetingText = utils.parseBytes32String(greetingBytes);
      setGreeting(greetingText);
      console.log(greetingText);
  });
  }

  addGreetListener();

  useEffect(() => {

    return () => {
      console.log("Removing the listener for greeting");
      contract.removeAllListeners("NewGreeting");
      setGreeting("Listening...");
    }
  });

  return <FormComponent greeting={greeting}></FormComponent>
}

