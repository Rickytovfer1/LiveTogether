package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISolicitudRepositorio extends JpaRepository<Solicitud, Integer> {
}
