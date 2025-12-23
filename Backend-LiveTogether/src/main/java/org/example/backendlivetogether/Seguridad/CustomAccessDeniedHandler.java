package org.example.backendlivetogether.Seguridad;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        String customMessage = "No tienes permiso para acceder a este recurso";
        int status = HttpServletResponse.SC_FORBIDDEN;
        String error = "Forbidden";

        if (accessDeniedException.getCause() instanceof ResponseStatusException) {
            ResponseStatusException rse = (ResponseStatusException) accessDeniedException.getCause();
            if (rse.getReason() != null) {
                customMessage = rse.getReason();
            }
            status = rse.getStatusCode().value();
            if (rse.getStatusCode() instanceof HttpStatus) {
                error = ((HttpStatus) rse.getStatusCode()).getReasonPhrase();
            } else {
                error = rse.getStatusCode().toString();
            }
        }
        
        // Configurar el código de estado
        response.setStatus(status);
        response.setContentType("application/json");
        // Crear el cuerpo de la respuesta
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", status);
        responseBody.put("error", error);
        responseBody.put("message", customMessage);
        responseBody.put("path", request.getRequestURI());

        // Escribir la respuesta como JSON
        response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
    }
}
