// useState, useRef, useEffect are hooks provided by react. Think of them as utility functions. More on react hooks - https://daily.dev/blog/react-hooks-explained-simply
import { useState, useRef, useEffect } from "react";
import "../styles.css";

// We are creating a OTP component with a prop otpLength
// Components in react are modular pieces of code that can be used to stitch together the entire web page
// Components are essentially functions that run and return the HTML from them so similar to function they can also take arguments called props
// More on react components - https://medium.com/@reactmasters.in/what-are-components-and-types-of-components-in-react-js-4e2642b136a2
export default function OTP({ otpLength = 6 }) {
  const [otpFields, setOtpFields] = useState(new Array(otpLength).fill(""));
  const ref = useRef([]);

  function handleKeyDown(e, index) {
    // handleKeyDown event gets triggered every single time a key is pressed when the focus is on an input
    const key = e.key; // This tells us which keyboard key has been pressed
    // console.log(key, e);

    if (key === "ArrowLeft") {
      if (index > 0) ref.current[index - 1].focus();
      return;
    }

    if (key === "ArrowRight") {
      if (index + 1 < otpFields.length) ref.current[index + 1].focus();
      return;
    }

    // Make a copy of the current array
    const copyOtpFields = [...otpFields];

    // Let's check if the key is backspace
    // and delete the digit in that scenario
    if (key === "Backspace") {
      copyOtpFields[index] = "";
      setOtpFields(copyOtpFields);

      if (index > 0) ref.current[index - 1].focus();
    }

    // We should allow single digit entry only
    if (!/^\d$/.test(key)) {
      // We check if the pressed key is not a number
      // we simply return from this function
      // as only numbers are allowed!
      return;
    }

    copyOtpFields[index] = key;
    setOtpFields(copyOtpFields);

    // use ref to focus on the next input box when an input is done
    if (index + 1 < otpFields.length) ref.current[index + 1].focus();
  }

  function handlePaste(e) {
    // handlePaste event handles the case where the user pastes a certain value inside the input
    e.preventDefault(); // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault

    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.match(/\d/g); // We are using this regex to extract the digits from the pasted data

    if (!digits) return;

    const nextOtp = otpFields.slice();

    // In  our current implementation
    // we will always paste from the beginning!!
    for (let i = 0; i < otpLength && digits.length; ++i) {
      nextOtp[i] = digits[i];
    }
    setOtpFields(nextOtp);

    const nextFocus = digits.length < otpLength ? digits.length : otpLength - 1;
    ref.current[nextFocus]?.focus();
  }

  useEffect(() => {
    ref.current[0]?.focus();
  }, []);

  return (
    <div className="container">
      {otpFields.map((value, index) => (
        <input
          key={index}
          ref={(currentInput) => (ref.current[index] = currentInput)}
          value={value}
          type="text"
          maxLength={1}
          className="otp-input"
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
