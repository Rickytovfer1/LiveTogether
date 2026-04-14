package org.example.backendlivetogether.Controladores;

import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Modelos.VerificationToken;
import org.example.backendlivetogether.Repositorios.IUsuarioRepositorio;
import org.example.backendlivetogether.Repositorios.IVerificationTokenRepositorio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
public class VerificacionControlador {

    private final IVerificationTokenRepositorio tokenRepository;
    private final IUsuarioRepositorio usuarioRepositorio;

    public VerificacionControlador(IVerificationTokenRepositorio tokenRepository, IUsuarioRepositorio usuarioRepositorio) {
        this.tokenRepository = tokenRepository;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        Optional<VerificationToken> optionalToken = tokenRepository.findByToken(token);
        if (!optionalToken.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido");
        }

        VerificationToken verificationToken = optionalToken.get();

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El token ha expirado");
        }

        Usuario usuario = verificationToken.getUsuario();
        usuario.setEnabled(true);
        usuarioRepositorio.save(usuario);

        tokenRepository.delete(verificationToken);

        return ResponseEntity.ok("Cuenta verificada exitosamente");
    }
}

