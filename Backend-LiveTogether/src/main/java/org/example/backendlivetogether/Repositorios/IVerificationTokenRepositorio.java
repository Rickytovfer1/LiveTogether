package org.example.backendlivetogether.Repositorios;


import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Modelos.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IVerificationTokenRepositorio extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    VerificationToken findByUsuario_Id(Integer idUsuario);
    Optional<VerificationToken> findByUsuario(Usuario usuario);
}

