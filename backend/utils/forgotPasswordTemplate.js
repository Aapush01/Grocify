const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div>
     <p>Dear, ${name}</p>
     <p>You’ve requested a password reset. Please use the following OTP code to proceed with resetting your password.</p>
    <div style="background: yellow; font-size: 20px; padding: 20px; text-align: center; font-weight: 800; width: fit-content; margin: 20px auto; border-radius: 8px;">
       ${otp}
    </div>

     <p>This OTP is valid for 1 hour. Please enter it on the Grocify website to complete your password reset.</p>
     <br />
     <br />
     <p>Thanks Grocify</p>
    </div>
    `;
};

export default forgotPasswordTemplate;
