package org.example.backendlivetogether.Seguridad;

import org.example.backendlivetogether.DTOs.TokenDataDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;


import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public class JWTAuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JWTService jwtService;

    public JWTAuthHandshakeInterceptor(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) throws Exception {

        System.out.println("Handshake Interceptor triggered: " + request.getURI());

        String query = request.getURI().getQuery();
        if (StringUtils.hasText(query)) {
            Map<String, String> queryParams = Arrays.stream(query.split("&"))
                    .map(param -> param.split("=", 2))
                    .filter(parts -> parts.length == 2)
                    .collect(Collectors.toMap(
                            parts -> parts[0],
                            parts -> parts[1]
                    ));
            String token = queryParams.get("access_token");
            System.out.println("Token found: " + token);

            if (StringUtils.hasText(token) && !jwtService.isExpired(token)) {
                TokenDataDTO tokenData = jwtService.extractTokenData(token);
                attributes.put("tokenData", tokenData);
                return true;
            }
        }

        response.setStatusCode(HttpStatus.FORBIDDEN);
        response.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:4200");
        response.getHeaders().add("Vary", "Origin");
        return false;
    }



    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
    }
}
