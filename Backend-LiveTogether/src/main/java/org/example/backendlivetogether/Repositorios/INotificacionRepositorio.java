package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface INotificacionRepositorio extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByComunidad(Comunidad comunidad);

}
