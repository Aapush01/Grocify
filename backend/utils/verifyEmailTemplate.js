const verifyEmailTemplate = ({ name, url }) => {
  return `
    <p>Dear ${name}</p>
    <p>Thank you for registering Grocify.</p>
    <a href=${url} style="color:black; background:orange; margin-top: 10px, padding: 20px, display:block">
    Verify Email
    </a>
    `;
};

export default verifyEmailTemplate;
