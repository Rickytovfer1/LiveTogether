package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Comunicado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IComunicadoRepositorio extends JpaRepository<Comunicado, Integer> {
}
