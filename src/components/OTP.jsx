
import { useState, useRef, useEffect } from "react";
import "../styles.css";


export default function OTP({ otpLength = 6 }) {
  const [otpFields, setOtpFields] = useState(new Array(otpLength).fill(""));
  const ref = useRef([]);

  function handleKeyDown(e, index) {
    const key = e.key; 

    if (key === "ArrowLeft") {
      if (index > 0) ref.current[index - 1].focus();
      return;
    }

    if (key === "ArrowRight") {
      if (index + 1 < otpFields.length) ref.current[index + 1].focus();
      return;
    }

    const copyOtpFields = [...otpFields];
    
    if (key === "Backspace") {
      copyOtpFields[index] = "";
      setOtpFields(copyOtpFields);

      if (index > 0) ref.current[index - 1].focus();
    }

    if (!/^\d$/.test(key)) {
      return;
    }

    copyOtpFields[index] = key;
    setOtpFields(copyOtpFields);

    if (index + 1 < otpFields.length) ref.current[index + 1].focus();
  }

  function handlePaste(e) {
    e.preventDefault(); 

    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.match(/\d/g); 

    if (!digits) return;

    const nextOtp = otpFields.slice();

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
