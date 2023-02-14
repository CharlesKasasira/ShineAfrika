const africastalking = require("africastalking");

const { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token = process.env.ZOHO_TOKEN;

let zeptoClient = new SendMailClient({ url, token });

const client = africastalking({
  username: process.env.AFRICASTALKING_USERNAME,
  apiKey: process.env.AFRICASTALKING_APIKEY,
});

export default function handler(req, res) {
  const { email, product, product_owner, product_link, telephone_number } =
    req.body;
  console.log({
    email,
    product,
    product_owner,
    product_link,
    telephone_number,
  });
  // console.log(req.body.email)
  try {
    zeptoClient
      .sendMail({
        bounce_address: "info@bounce.theablestate.com",
        from: {
          address: "noreply@theablestate.com",
          name: "Ablestate Cloud",
        },
        to: [
          {
            email_address: {
              address: email,
              // name: "Charles",
            },
          },
        ],
        subject: `${product_link} has been extended `,
        textbody: "Your website has been extended",
        htmlbody: `<html><body><h2>Hi ${product_owner},</h2>
          I hope that you are well. We are informing you that that your ${product} - <b>${product_link}</b> has been extended successfully.Thank you
          <br />
          <br />
          If you require any further assistance, please let us know cloud@ablestate.co.
            <br />
            <br />
            <footer>
              <p>Best regards,</p>
              <p><b>Ablestate Cloud</b></p>
              <a href="https://bills.ablestate.co/">
                bills.ablestate.co
              </a>
            </footer></body></html>`,
        track_clicks: true,
        track_opens: true,
      })
      .then()
      .catch();

    client.SMS.send({
      to: telephone_number,
      message: `${product_link} has been extended successfully.`,
    });

    res.send({ message: null });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
}
