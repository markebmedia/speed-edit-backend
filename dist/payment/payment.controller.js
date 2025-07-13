"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createCheckout(imageUrl, res) {
        if (!imageUrl) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: 'Missing imageUrl' });
        }
        try {
            const sessionUrl = await this.paymentService.createCheckoutSession(imageUrl);
            return res.status(common_1.HttpStatus.OK).json({ url: sessionUrl });
        }
        catch (error) {
            console.error('Stripe Error:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create checkout session' });
        }
    }
    async paymentSuccess(sessionId, res) {
        if (!sessionId) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send('Missing session ID');
        }
        try {
            const session = await this.paymentService.retrieveSession(sessionId);
            const imageUrl = session.payment_intent.metadata?.imageUrl;
            return res.send(`
        <html>
          <head><title>Payment Success</title></head>
          <body style="font-family: sans-serif; text-align: center; padding-top: 100px;">
            <h1>✅ Payment Successful!</h1>
            <p>Your image is ready to download:</p>
            <a href="${imageUrl}" download style="font-size: 18px;">⬇️ Download Image</a>
          </body>
        </html>
      `);
        }
        catch (err) {
            console.error(err);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send('Error retrieving payment details.');
        }
    }
    paymentCancel(res) {
        return res.send(`
      <html>
        <head><title>Payment Cancelled</title></head>
        <body style="font-family: sans-serif; text-align: center; padding-top: 100px;">
          <h1>❌ Payment Cancelled</h1>
          <p>No worries. You can try again anytime.</p>
          <a href="/">Return to Home</a>
        </body>
      </html>
    `);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('create-checkout'),
    __param(0, (0, common_1.Body)('imageUrl')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Get)('success'),
    __param(0, (0, common_1.Query)('session_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentSuccess", null);
__decorate([
    (0, common_1.Get)('cancel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "paymentCancel", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map