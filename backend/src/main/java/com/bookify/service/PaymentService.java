package com.bookify.service;

import com.bookify.dto.response.marketplace.PaymentIntentResponse;
import com.bookify.entity.Order;
import com.bookify.entity.OrderStatus;
import com.bookify.entity.Payment;
import com.bookify.entity.PaymentStatus;
import com.bookify.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${bookify.stripe.secret-key:sk_test_mock_key}")
    private String stripeSecretKey;

    @Value("${bookify.stripe.publishable-key:pk_test_mock_key}")
    private String stripePublishableKey;

    @PostConstruct
    public void init() {
        if (stripeSecretKey != null && !stripeSecretKey.startsWith("sk_test_mock")) {
            Stripe.apiKey = stripeSecretKey;
        }
    }

    @Transactional
    public PaymentIntentResponse createPaymentIntent(Order order) {
        String clientSecret;
        String paymentIntentId;

        // Try live Stripe API if configured; otherwise generate local mock secret for seamless testing
        if (stripeSecretKey != null && !stripeSecretKey.startsWith("sk_test_mock")) {
            try {
                long amountInCents = Math.round(order.getTotalAmount().doubleValue() * 100);
                PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                        .setAmount(amountInCents)
                        .setCurrency("usd")
                        .putMetadata("orderId", order.getId().toString())
                        .putMetadata("orderNumber", order.getOrderNumber())
                        .putMetadata("buyerId", order.getBuyer().getId().toString())
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

                PaymentIntent intent = PaymentIntent.create(params);
                clientSecret = intent.getClientSecret();
                paymentIntentId = intent.getId();
            } catch (Exception e) {
                log.warn("Stripe API call failed (falling back to mock): {}", e.getMessage());
                paymentIntentId = "pi_mock_" + UUID.randomUUID();
                clientSecret = paymentIntentId + "_secret_mock";
            }
        } else {
            paymentIntentId = "pi_mock_" + UUID.randomUUID();
            clientSecret = paymentIntentId + "_secret_mock";
        }

        order.setStripePaymentIntentId(paymentIntentId);

        Payment payment = Payment.builder()
                .order(order)
                .paymentGateway("STRIPE")
                .gatewayPaymentId(paymentIntentId)
                .amount(order.getTotalAmount())
                .currency("USD")
                .paymentStatus(PaymentStatus.INITIATED)
                .build();
        paymentRepository.save(payment);

        return PaymentIntentResponse.builder()
                .clientSecret(clientSecret)
                .paymentIntentId(paymentIntentId)
                .publishableKey(stripePublishableKey)
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .amount(order.getTotalAmount())
                .currency("USD")
                .build();
    }

    @Transactional
    public void confirmPaymentSuccess(String paymentIntentId) {
        paymentRepository.findByGatewayPaymentId(paymentIntentId).ifPresent(payment -> {
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.getOrder().setOrderStatus(OrderStatus.PAID);
            paymentRepository.save(payment);
        });
    }
}
