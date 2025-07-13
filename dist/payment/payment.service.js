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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
let PaymentService = class PaymentService {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2022-11-15',
        });
    }
    async createCheckoutSession(imageUrl) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: 'Speed Edit Download',
                            images: [imageUrl],
                        },
                        unit_amount: 199,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `https://www.markebmedia.com/speed-edit-upload?success=true`,
            cancel_url: `https://www.markebmedia.com/speed-edit-upload?cancelled=true`,
            metadata: { imageUrl },
        });
        return session.url;
    }
    async retrieveSession(sessionId) {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PaymentService);
//# sourceMappingURL=payment.service.js.map