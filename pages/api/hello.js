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
  console.log(req.body);
  console.log("show logs");
  try {
    req.body?.day &&
      req.body?.day.forEach((website, index) => {
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
                  address: website.email,
                  // name: "Charles",
                },
              },
            ],
            subject: `${website.name} Expiry Date`,
            textbody: "Kindly update your websites payment to keep it online",
            htmlbody: `<html><body><h2>Hi ${website.name},</h2>
          I hope that you are well. We are informing you that the website/domain - <b>${website.website_link}</b> is expiring today.
          <br /> To avoid inconveniences, login to <a href="https://bills.ablestate.co/">www.bills.ablestate.co/</a> and make a renewal payment.
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
          // to: `+256${website.telephone_number}`,
          to: website.telephone_number,
          message: `Your website ${website.name.toUpperCase()} (${
            website.website_link
          }) will expiry in a day. Please login in to https://bills.ablestate.co to make payment. If you require any further information, let us know.`,
        })
          .then((response) => res.status(200).json(response))
          .catch((error) => res.status(503).json(error));
      });

    req.body?.day4 &&
      req.body.managers.forEach((manager, index) => {
        req.body?.day4.forEach((website, index) => {
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
                    address: manager.email,
                  },
                },
              ],
              subject: `${website.name} will expire this week`,
              textbody: "Kindly update your websites payment to keep it online",
              htmlbody: `<html><body><h2>Hi ${manager.first_name},</h2>
            We are informing you that ${website.name} recieved a notification that <b>${website.website_link}</b> is expiring in less than a week but has not renewed it yet.
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
            to: manager.contact_number,
            message: `${website.website_link} is expiring in less than a week but has not be renewed yet. `,
          })
            .then((response) => res.status(200).json(response))
            .catch((error) => res.status(503).json(error));
        });
      });

    req.body?.week &&
      req.body?.week.forEach((website, index) => {
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
                  address: website.email,
                  // name: "Charles",
                },
              },
            ],
            subject: `${website.name} Expiry Date`,
            textbody: "Kindly update your websites payment to keep it online",
            htmlbody: `<html><body><h2>Hi ${website.name},</h2>
          I hope that you are well. We are informing you that the website/domain - <b>${website.website_link}</b> is expiring in a week.
          <br /> To avoid inconveniences, login to <a href="https://bills.ablestate.co/">bills.ablestate.co</a> and make a renewal payment.
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
          // to: `+256${website.telephone_number}`,
          to: website.telephone_number,
          message: `Your website ${website.name.toUpperCase()} (${
            website.website_link
          }) will expiry in a week. Please login in to https://bills.ablestate.co to make payment. If you require any further information, let us know.`,
        })
          .then((response) => res.status(200).json(response))
          .catch((error) => res.status(503).json(error));
      });

    req.body?.month &&
      req.body?.month.forEach((website, index) => {
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
                  address: website.email,
                  // name: "Charles",
                },
              },
            ],
            subject: `${website.name} Expiry Date`,
            textbody: "Kindly update your websites payment to keep it online",
            htmlbody: `<html><body><h2>Hi ${website.name},</h2>
          I hope that you are well. We are informing you that the website/domain - <b>${website.website_link}</b> is expiring in a month.
          <br /> To avoid inconveniences, login to <a href="https://bills.ablestate.co/">bills.ablestate.co</a> and make a renewal payment.
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
          // to: `+256${website.telephone_number}`,
          to: website.telephone_number,
          message: `Your website ${website.name.toUpperCase()} (${
            website.website_link
          }) will expiry in a month. Please login in to https://bills.ablestate.co to make payment. If you require any further information, let us know.`,
        })
          .then((response) => res.status(200).json(response))
          .catch((error) => res.status(503).json(error));
      });

    req.body?.two_months &&
      req.body?.two_months.forEach((website, index) => {
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
                  address: website.email,
                  // name: "Charles",
                },
              },
            ],
            subject: `${website.name} Expiry Date`,
            textbody: "Kindly update your websites payment to keep it online",
            htmlbody: `<html><body><h2>Hi ${website.name},</h2>
          I hope that you are well. We are informing you that the website/domain - <b>${website.website_link}</b> is expiring in 60 days.
          <br /> To avoid inconveniences, login to <a href="https://bills.ablestate.co/">bills.ablestate.co</a> and make a renewal payment.
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
          to: website.telephone_number,
          message: `Your website ${website.name.toUpperCase()} (${
            website.website_link
          }) will expiry in a 60 days. Please login in to https://bills.ablestate.co to make payment. If you require any further information, let us know.`,
        })
          .then((response) => res.status(200).json(response))
          .catch((error) => res.status(503).json(error));
      });

    req.body?.expired_3days &&
      req.body?.expired_3days.forEach((website, index) => {
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
                  address: website.email,
                },
              },
            ],
            subject: `${website.name} Expired`,
            textbody: "Kindly update your websites payment to keep it online",
            htmlbody: `<html><body><h2>Hi ${website.name},</h2>
          I hope that you are well. We are informing you that the website/domain - <b>${website.website_link}</b> expired three days ago.
          <br /> To avoid inconveniences, login to <a href="https://bills.ablestate.co/">bills.ablestate.co</a> and make a renewal payment.
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
          to: website.telephone_number,
          message: `Your website ${website.name.toUpperCase()} (${
            website.website_link
          }) will expired a 3 days. Please login in to https://bills.ablestate.co to make payment. If you require any further information, let us know.`,
        })
          .then((response) => res.status(200).json(response))
          .catch((error) => res.status(503).json(error));
      });

    req.body?.expired_week_ago &&
      req.body?.expired_week_ago.forEach((website, index) => {
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
                  address: website.email,
                },
              },
            ],
            subject: `${website.name} Expired`,
            textbody: "Kindly update your websites payment to keep it online",
            htmlbody: `<html><body><h2>Hi ${website.name},</h2>
          I hope that you are well. We are informing you that the website/domain - <b>${website.website_link}</b> expired a week ago.
          <br /> To avoid inconveniences, login to <a href="https://bills.ablestate.co/">bills.ablestate.co</a> and make a renewal payment.
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
          to: website.telephone_number,
          message: `Your website ${website.name.toUpperCase()} (${
            website.website_link
          }) will expired a 3 days. Please login in to https://bills.ablestate.co to make payment. If you require any further information, let us know.`,
        })
          .then((response) => res.status(200).json(response))
          .catch((error) => res.status(503).json(error));
      });

    res.send({ message: null });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
}
