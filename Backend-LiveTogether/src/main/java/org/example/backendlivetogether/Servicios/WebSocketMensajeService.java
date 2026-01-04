package org.example.backendlivetogether.Servicios;

import org.example.backendlivetogether.DTOs.MensajeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import java.util.HashMap;
import java.util.Map;

@Service
@EnableWebSocketMessageBroker
public class WebSocketMensajeService {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketMensajeService(@Lazy SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    private Map<String, Object> createMessage(String action, MensajeDTO mensaje) {
        Map<String, Object> data = new HashMap<>();
        data.put("action", action);
        data.put("mensaje", mensaje);
        return data;
    }

    public void enviarMensaje(MensajeDTO mensaje) {
        String cid = conversationId(mensaje.getIdEmisor(), mensaje.getIdReceptor());
        messagingTemplate.convertAndSend("/topic/conversacion/" + cid, createMessage("create", mensaje));
    }

    private String conversationId(Integer a, Integer b) {
        return a < b ? a + "-" + b : b + "-" + a;
    }


    public void enviarMensajeEditado(MensajeDTO mensaje) {
        String c1 = "/topic/conversacion/" + mensaje.getIdEmisor() + "-" + mensaje.getIdReceptor();
        String c2 = "/topic/conversacion/" + mensaje.getIdReceptor() + "-" + mensaje.getIdEmisor();
        messagingTemplate.convertAndSend(c1, createMessage("update", mensaje));
        messagingTemplate.convertAndSend(c2, createMessage("update", mensaje));
    }

    public void enviarMensajeEliminado(MensajeDTO mensaje) {
        String c1 = "/topic/conversacion/" + mensaje.getIdEmisor() + "-" + mensaje.getIdReceptor();
        String c2 = "/topic/conversacion/" + mensaje.getIdReceptor() + "-" + mensaje.getIdEmisor();
        messagingTemplate.convertAndSend(c1, createMessage("delete", mensaje));
        messagingTemplate.convertAndSend(c2, createMessage("delete", mensaje));
    }
}

