package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface INotificacionRepositorio extends JpaRepository<Notificacion, Integer> {
}
