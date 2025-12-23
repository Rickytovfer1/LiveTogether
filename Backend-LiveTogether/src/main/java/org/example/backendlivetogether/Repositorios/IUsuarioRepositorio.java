package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface IUsuarioRepositorio extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findUsuarioByCorreo(String correo);
    Optional<Usuario> findTopByCorreo(String correo);
}
