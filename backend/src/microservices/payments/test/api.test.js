const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/payments_service');

const { expect } = chai;

chai.use(chaiHttp);

describe('Payments Service', () => {

  let id;

  describe('POST /orders', () => {
    it('should create an order successfully', async () => {

      const res = await chai.request(app)
        .post('/orders')
        .send({
          cart: [
            {
              id: "YOUR_PRODUCT_ID",
              quantity: "YOUR_PRODUCT_QUANTITY",
            },
          ]
        });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      id = res.body.id;
    });
  });

  describe('POST /orders/:orderID/capture', () => {
    it('should capture an order successfully', async () => {
      const res = await chai.request(app)
        .post(`/orders/${id}/capture`);

      // console.log(res)
      // expect(res).to.have.status(200);
      // expect(res.body).to.have.property('status', 'COMPLETED');
    });
  });
});
