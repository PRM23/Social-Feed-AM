import React from "react";
import ReactDOM from "react-dom";
import { GoogleLogin } from "react-google-login";

// import "./styles.css";

const responseGoogle = (response) => {
  console.log(response);
};

function LoginWithGoogle() {
  return (
    <div>
      {/* <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2> */}

      <GoogleLogin
        clientId="326538060414-5vqrgaosddu857h2siom011r796tfl4j.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </div>
  );
}
export default LoginWithGoogle;
