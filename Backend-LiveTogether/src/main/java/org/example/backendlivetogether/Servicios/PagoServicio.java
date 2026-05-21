package org.example.backendlivetogether.Servicios;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.example.backendlivetogether.DTOs.PagoDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Service
public class PagoServicio {


    public PagoServicio() {
        Stripe.apiKey = "sk_test_51RIofJQu2AOfAVJhXEcrduViKhveomANjIT80QHzUQYeo5U46ZRzYnoxvAZvHxffemkkTAeZjqhHuH3xSDwncYGT00LlVvAEd0";
    }

    public Map<String, String> crearSesion(@RequestBody PagoDTO dto) {
        Map<String, String> respuesta = new HashMap<>();

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("https://livetogether-front.onrender.com/exito")
                    .setCancelUrl("https://livetogether-front.onrender.com/cancelado")
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("eur")
                                                    .setUnitAmount(dto.getCantidad())
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(dto.getGasto())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session sesion = Session.create(params);
            respuesta.put("idSesion", sesion.getId());
        } catch (Exception e) {
            e.printStackTrace();
            respuesta.put("error", "Error al crear la sesión de pago");
        }

        return respuesta;
    }

}
